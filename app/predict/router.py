import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models.history import PadiBuyHistory
from app.models.user import User
from app.predict import schemas
from app.predict.features import CURRENT_YEAR, build_feature_vector
from app.predict.service import get_model_version, hitung_prediksi_impulsive

router = APIRouter(prefix="/predict", tags=["PadiBuy Prediction"])


def history_to_dict(history: PadiBuyHistory) -> dict:
    input_data = None
    if history.input_json:
        try:
            input_data = json.loads(history.input_json)
        except json.JSONDecodeError:
            input_data = None

    return {
        "id": history.id,
        "user_id": history.user_id,
        "umur": history.umur,
        "pendapatan": history.pendapatan,
        "skor_diskon": history.skor_diskon,
        "skor_emosi": history.skor_emosi,
        "is_impulsive": history.is_impulsive,
        "confidence_rate": history.confidence_rate,
        "model_version": history.model_version,
        "input_json": input_data,
        "created_at": history.created_at,
    }


@router.post("/predict", response_model=schemas.PredictionResponse)
def prediksi_perilaku_belanja(
    request: schemas.RequestPrediksiPadiBuy,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    fitur_input = build_feature_vector(request)
    hasil_ml = hitung_prediksi_impulsive(fitur_input)

    if "error" in hasil_ml:
        raise HTTPException(status_code=500, detail=hasil_ml["error"])

    data_riwayat = PadiBuyHistory(
        user_id=current_user.id,
        umur=CURRENT_YEAR - request.year_of_birth,
        pendapatan=request.monthly_income,
        skor_diskon=request.skor_promosi,
        skor_emosi=request.skor_negative_emotion,
        is_impulsive=hasil_ml["is_impulsive"],
        confidence_rate=hasil_ml["confidence_percentage"],
        model_version=get_model_version(),
        input_json=request.model_dump_json(),
    )

    try:
        db.add(data_riwayat)
        db.commit()
        db.refresh(data_riwayat)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal menyimpan riwayat prediksi")

    return {
        "status": "success",
        "aplikasi": "PadiBuy Mobile",
        "data": {
            "id_riwayat": data_riwayat.id,
            "kesimpulan": "Impulsive Buyer" if hasil_ml["is_impulsive"] == 1 else "Wise Buyer",
            "persentase_kecenderungan": hasil_ml["confidence_percentage"],
            "pesan": hasil_ml["message"],
        },
    }


@router.get("/history", response_model=schemas.HistoryResponse)
def ambil_riwayat_padibuy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    riwayat = (
        db.query(PadiBuyHistory)
        .filter(PadiBuyHistory.user_id == current_user.id)
        .order_by(PadiBuyHistory.created_at.desc())
        .all()
    )
    return {"status": "success", "riwayat_user": [history_to_dict(item) for item in riwayat]}
