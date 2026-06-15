# PadiBuy - Prediction of Impulsive Buying

API backend berbasis FastAPI untuk prediksi perilaku belanja impulsif menggunakan Random Forest. Dirancang untuk terintegrasi dengan aplikasi mobile React Native.

## Fitur Utama
- Autentikasi JWT (Register & Login)
- Prediksi perilaku belanja impulsif via `/api/predict/predict`
- Riwayat prediksi per user via `/api/predict/history`
- Database SQLite

## Setup
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Dokumentasi API
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
