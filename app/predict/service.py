import joblib
import numpy as np
import os

MODEL_PATH = os.getenv("MODEL_PATH", "models/rf_model.pkl")

_model = None

def load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model tidak ditemukan di {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model

def hitung_prediksi_impulsive(fitur_input):
    try:
        model = load_model()
        input_array = np.array([fitur_input])
        prediksi = model.predict(input_array)[0]
        proba = model.predict_proba(input_array)[0]
        confidence = float(max(proba) * 100)

        if prediksi == 1:
            message = "Berdasarkan jawaban Anda, Anda cenderung melakukan pembelian impulsif. Perlu lebih bijak dalam mengelola keuangan."
        else:
            message = "Selamat! Anda termasuk pembeli yang bijak dan dapat mengontrol keinginan belanja Anda."

        return {
            "is_impulsive": int(prediksi),
            "confidence_percentage": round(confidence, 2),
            "message": message
        }
    except Exception as e:
        return {"error": str(e)}
