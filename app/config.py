from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PadiBuy API"
    PROJECT_DESCRIPTION: str = "Prediction of Impulsive Buying - API untuk analisis perilaku belanja impulsif"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = "padibuy-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
