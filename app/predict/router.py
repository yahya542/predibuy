from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.predict.service import hitung_prediksi_impulsive
from app.models.history import PadiBuyHistory
from app.auth.security import get_current_user

router = APIRouter(prefix="/predict", tags=["PadiBuy Prediction"])

class RequestPrediksiPadiBuy(BaseModel):
    umur: int
    pendapatan: float
    skor_diskon: int
    skor_emosi: int

@router.post("/predict")
def prediksi_perilaku_belanja(
    request: RequestPrediksiPadiBuy,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    fitur_input = [request.umur, request.pendapatan, request.skor_diskon, request.skor_emosi]
    hasil_ml = hitung_prediksi_impulsive(fitur_input)

    if "error" in hasil_ml:
        raise HTTPException(status_code=500, detail=hasil_ml["error"])

    data_riwayat = PadiBuyHistory(
        user_id=current_user["id"],
        umur=request.umur,
        pendapatan=request.pendapatan,
        skor_diskon=request.skor_diskon,
        skor_emosi=request.skor_emosi,
        is_impulsive=hasil_ml["is_impulsive"],
        confidence_rate=hasil_ml["confidence_percentage"]
    )
    db.add(data_riwayat)
    db.commit()
    db.refresh(data_riwayat)

    return {
        "status": "success",
        "aplikasi": "PadiBuy Mobile",
        "data": {
            "id_riwayat": data_riwayat.id,
            "kesimpulan": "Impulsive Buyer" if hasil_ml["is_impulsive"] == 1 else "Wise Buyer",
            "persentase_kecenderungan": hasil_ml["confidence_percentage"],
            "pesan": hasil_ml["message"]
        }
    }

@router.get("/history")
def ambil_riwayat_padibuy(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    riwayat = db.query(PadiBuyHistory).filter(PadiBuyHistory.user_id == current_user["id"]).all()
    return {"status": "success", "riwayat_user": riwayat}
