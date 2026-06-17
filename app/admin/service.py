import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from fastapi import UploadFile
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score, log_loss
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from app.config import settings
from app.predict.features import MODEL_FEATURE_COLUMNS, RAW_DATASET_COLUMNS, build_features_from_dataset
from app.predict.service import invalidate_model_cache

DATASET_EXTENSIONS = {".csv", ".xlsx", ".xls"}


def sanitize_filename(filename: str) -> str:
    sanitized = re.sub(r"[^a-zA-Z0-9._-]+", "_", filename).strip("._")
    return sanitized or "dataset"


def resolve_dataset_path(filename: str | None = None) -> Path:
    dataset_dir = Path(settings.DATASET_DIR)
    if filename is None:
        files = sorted(
            [
                path
                for path in dataset_dir.iterdir()
                if path.is_file() and path.suffix.lower() in DATASET_EXTENSIONS
            ],
            key=lambda path: path.stat().st_mtime,
            reverse=True,
        )
        if not files:
            raise FileNotFoundError("Belum ada dataset yang diupload")
        return files[0]

    path = Path(filename)
    if path.exists():
        return path
    if not path.is_absolute():
        path = dataset_dir / path
    if not path.exists() or path.suffix.lower() not in DATASET_EXTENSIONS:
        raise FileNotFoundError("Dataset tidak ditemukan")
    return path


def read_dataset(path: Path) -> pd.DataFrame:
    if path.suffix.lower() == ".csv":
        df = pd.read_csv(path)
    else:
        df = pd.read_excel(path)
    df.columns = [str(column).strip() for column in df.columns]
    return df


def validate_dataset(path: Path) -> pd.DataFrame:
    df = read_dataset(path)
    missing_columns = [column for column in RAW_DATASET_COLUMNS if column not in df.columns]
    if missing_columns:
        raise ValueError(f"Dataset tidak valid. Kolom yang hilang: {', '.join(missing_columns)}")

    if "Impulsive_Target" not in df.columns:
        raise ValueError("Dataset tidak memiliki kolom Impulsive_Target")

    return df


def save_uploaded_dataset(upload_file: UploadFile) -> dict:
    if upload_file.filename is None:
        raise ValueError("Nama file dataset tidak boleh kosong")

    suffix = Path(upload_file.filename).suffix.lower()
    if suffix not in DATASET_EXTENSIONS:
        raise ValueError("Format dataset harus CSV, XLS, atau XLSX")

    dataset_dir = Path(settings.DATASET_DIR)
    dataset_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    saved_filename = f"{timestamp}-{sanitize_filename(upload_file.filename)}"
    saved_path = dataset_dir / saved_filename

    with saved_path.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return dataset_info(saved_path)


def dataset_info(path: Path) -> dict:
    info = {
        "filename": path.name,
        "path": str(path),
        "size_bytes": path.stat().st_size,
        "uploaded_at": datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc),
        "rows": None,
        "columns": None,
        "valid": False,
    }

    try:
        df = validate_dataset(path)
        info["rows"] = int(len(df))
        info["columns"] = int(len(df.columns))
        info["valid"] = True
    except Exception:
        info["rows"] = None
        info["columns"] = None
        info["valid"] = False

    return info


def list_datasets() -> list[dict]:
    dataset_dir = Path(settings.DATASET_DIR)
    if not dataset_dir.exists():
        return []

    return [
        dataset_info(path)
        for path in sorted(dataset_dir.iterdir(), key=lambda path: path.stat().st_mtime, reverse=True)
        if path.is_file() and path.suffix.lower() in DATASET_EXTENSIONS
    ]


def train_model(dataset_path: Path | None = None) -> dict:
    selected_path = resolve_dataset_path(str(dataset_path)) if dataset_path else resolve_dataset_path()
    df = validate_dataset(selected_path)

    # Langkah 3: Ekstraksi Fitur
    X = build_features_from_dataset(df)
    y = df["Impulsive_Target"].astype(int)

    # Langkah 4: Pembagian Data (Kunci random_state=42 agar split data sama dengan Colab)
    stratify = y if y.nunique() > 1 else None
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=stratify,
    )

    # Langkah 5: Pembangunan Base Pipeline
    base_pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "model",
                RandomForestClassifier(
                    class_weight="balanced",
                    random_state=42,  # Mengunci keacakan pohon internal
                    n_jobs=-1,
                ),
            ),
        ]
    )

    # Langkah 6: Optimasi Parameter Menggunakan GridSearchCV
    param_grid = {
        "model__n_estimators": [100, 200, 300],
        "model__max_depth": [None, 10, 20],
        "model__min_samples_split": [2, 5],
    }

    # CV Folds disesuaikan aman untuk edge-case target tunggal jika ada
    cv_folds = 5 if (stratify is not None and y_train.nunique() > 1) else 2

    grid_search = GridSearchCV(
        estimator=base_pipeline,
        param_grid=param_grid,
        cv=cv_folds,
        scoring="f1_weighted",
        n_jobs=-1,
    )
    
    # Eksekusi pencarian parameter terbaik
    grid_search.fit(X_train, y_train)
    best_pipeline = grid_search.best_estimator_

    # Langkah 7: Evaluasi Model (Klasifikasi dan Penambahan Nilai Error/Loss)
    predictions = best_pipeline.predict(X_test)
    metrics = {
        "accuracy": float(accuracy_score(y_test, predictions)),
        "precision": float(precision_score(y_test, predictions, zero_division=0, average="weighted")),
        "recall": float(recall_score(y_test, predictions, zero_division=0, average="weighted")),
        "f1": float(f1_score(y_test, predictions, zero_division=0, average="weighted")),
        "roc_auc": None,
        "log_loss": None,
    }

    if y_test.nunique() > 1:
        probabilities = best_pipeline.predict_proba(X_test)
        metrics["roc_auc"] = float(roc_auc_score(y_test, probabilities[:, 1]))
        metrics["log_loss"] = float(log_loss(y_test, probabilities))

    # Langkah 8: Analisis Fitur Paling Berpengaruh (Feature Importance)
    best_rf_model = best_pipeline.named_steps["model"]
    importances = best_rf_model.feature_importances_
    
    # Memetakan nilai kepentingannya dengan urutan menurun (descending)
    feature_importance_dict = {
        feature: float(importance)
        for feature, importance in sorted(
            zip(MODEL_FEATURE_COLUMNS, importances), key=lambda item: item[1], reverse=True
        )
    }

    # Langkah 9 & 10: Penyimpanan Artefak Berkas .joblib
    model_path = Path(settings.MODEL_PATH)
    model_path.parent.mkdir(parents=True, exist_ok=True)

    artifact = {
        "pipeline": best_pipeline,
        "best_params": grid_search.best_params_,
        "feature_columns": MODEL_FEATURE_COLUMNS,
        "feature_importance": feature_importance_dict,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset": str(selected_path),
        "metrics": metrics,
    }
    joblib.dump(artifact, model_path)
    invalidate_model_cache()

    return {
        "status": "success",
        "model_path": str(model_path),
        "trained_at": artifact["trained_at"],
        "dataset": str(selected_path),
        "best_params": grid_search.best_params_,
        "feature_columns": MODEL_FEATURE_COLUMNS,
        "feature_importance": feature_importance_dict,
        "metrics": metrics,
    }