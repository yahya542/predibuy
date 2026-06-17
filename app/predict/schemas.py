from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RequestPrediksiPadiBuy(BaseModel):
    gender: int = Field(ge=1, le=2)
    paylater_status: int = Field(ge=1, le=2)
    education: int = Field(ge=1, le=4)
    year_of_birth: int = Field(ge=1900, le=2100)
    job_status: int = Field(ge=1, le=4)
    monthly_income: float = Field(ge=0)
    avg_expenditure_ratio: int = Field(ge=1, le=6)
    skor_ibb: float = Field(ge=1, le=5)
    skor_promosi: float = Field(ge=1, le=5)
    skor_social_influence: float = Field(ge=1, le=5)
    skor_hedonic: float = Field(ge=1, le=5)
    skor_self_control: float = Field(ge=1, le=5)
    skor_negative_emotion: float = Field(ge=1, le=5)


class PredictionData(BaseModel):
    id_riwayat: int
    kesimpulan: str
    persentase_kecenderungan: float
    pesan: str


class PredictionResponse(BaseModel):
    status: str
    aplikasi: str
    data: PredictionData


class HistoryItem(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    id: int
    user_id: int
    umur: int
    pendapatan: float
    skor_diskon: float
    skor_emosi: float
    is_impulsive: int
    confidence_rate: float
    model_version: Optional[str] = None
    input_json: Optional[dict] = None
    created_at: datetime


class HistoryResponse(BaseModel):
    status: str
    riwayat_user: list[HistoryItem]
