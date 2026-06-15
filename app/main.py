from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.config import settings
from app.auth.router import router as auth_router
from app.predict.router import router as predict_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(predict_router)

@app.get("/")
def root():
    return {
        "aplikasi": "PadiBuy",
        "versi": settings.VERSION,
        "deskripsi": "Prediction of Impulsive Buying API",
        "dokumentasi": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "PadiBuy API"}
