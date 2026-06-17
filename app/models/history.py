from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class PadiBuyHistory(Base):
    __tablename__ = "padibuy_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    umur = Column(Integer, nullable=False)
    pendapatan = Column(Float, nullable=False)
    skor_diskon = Column(Integer, nullable=False)
    skor_emosi = Column(Integer, nullable=False)

    is_impulsive = Column(Integer, nullable=False)
    confidence_rate = Column(Float, nullable=False)
    model_version = Column(String, nullable=True)
    input_json = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
