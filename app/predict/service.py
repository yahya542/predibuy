from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.config import settings

_model = None
_model_path = None
_model_loaded_at = None
_model_feature_columns = None


def invalidate_model_cache():
    global _model, _model_path, _model_loaded_at, _model_feature_columns
    _model = None
    _model_path = None
    _model_loaded_at = None
    _model_feature_columns = None


def load_model():
    global _model, _model_path, _model_loaded_at, _model_feature_columns
    if _model is None or _model_path != settings.MODEL_PATH:
        model_file = Path(settings.MODEL_PATH)
        if not model_file.exists():
            raise FileNotFoundError(f"Model tidak ditemukan di {settings.MODEL_PATH}")

        artifact = joblib.load(model_file)
        if isinstance(artifact, dict):
            model = artifact.get("pipeline", artifact)
            _model_feature_columns = artifact.get("feature_columns")
        else:
            model = artifact
            _model_feature_columns = None

        if not hasattr(model, "predict"):
            raise ValueError("Artifact model tidak memiliki method predict")

        _model = model
        _model_path = settings.MODEL_PATH
        _model_loaded_at = datetime.fromtimestamp(model_file.stat().st_mtime, tz=timezone.utc).isoformat()

    return _model


def get_model_version() -> str:
    model_file = Path(settings.MODEL_PATH)
    if not model_file.exists():
        return "untrained"
    return datetime.fromtimestamp(model_file.stat().st_mtime, tz=timezone.utc).isoformat()


def hitung_prediksi_impulsive(fitur_input: list[float]):
    try:
        model = load_model()
        input_data = np.asarray([fitur_input], dtype=float)
        if _model_feature_columns:
            input_data = pd.DataFrame([fitur_input], columns=_model_feature_columns)
        prediksi = int(model.predict(input_data)[0])
        confidence = 0.0

        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(input_data)[0]
            classes = list(getattr(model, "classes_", []))
            if classes and prediksi in classes:
                confidence = float(proba[classes.index(prediksi)] * 100)
            else:
                confidence = float(max(proba) * 100)

        if prediksi == 1:
            message = "Berdasarkan jawaban Anda, Anda cenderung melakukan pembelian impulsif. Perlu lebih bijak dalam mengelola keuangan."
        else:
            message = "Selamat! Anda termasuk pembeli yang bijak dan dapat mengontrol keinginan belanja Anda."

        return {
            "is_impulsive": int(prediksi),
            "confidence_percentage": round(confidence, 2),
            "message": message,
        }
    except Exception as exc:
        return {"error": str(exc)}
