from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "PadiBuy API"
    PROJECT_DESCRIPTION: str = "Prediction of Impulsive Buying - API untuk analisis perilaku belanja impulsif"
    VERSION: str = "1.0.0"
    
    # Variabel dari .env (Wajib didaftarkan karena ada di .env)
    DATABASE_URL: str
    MODEL_PATH: str
    SECRET_KEY: str = "padibuy-secret-key-change-in-production"
    DATASET_DIR: str = "datasets"
    ADMIN_EMAILS: str = ""
    
    # Variabel tambahan
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Konfigurasi Pydantic v2 untuk membaca .env
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",            # Mengabaikan jika ada variabel lain di .env
        case_sensitive=False       # Mengabaikan perbedaan huruf besar/kecil antara .env dan kode
    )

settings = Settings()
