from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    APP_NAME: str = "UAE Car Showroom Management System"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/car_showroom"
    SQLITE_URL: str = "sqlite+aiosqlite:///./car_showroom.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    ALLOWED_HOSTS: List[str] = ["*"]
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://*.uae-carshowroom.com",
    ]

    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "me-central-1"
    S3_BUCKET: str = "uae-car-showroom"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "noreply@uae-carshowroom.com"

    VAT_RATE: float = 0.05
    DEFAULT_CURRENCY: str = "AED"
    MULTI_TENANT: bool = True
    MAX_UPLOAD_SIZE: int = 50_000_000
    AI_MODEL_PATH: str = "app/ai/models"

    SENTRY_DSN: str = ""

    @property
    def database_url_async(self) -> str:
        if self.ENVIRONMENT == "production":
            return self.DATABASE_URL  # PostgreSQL
        return self.SQLITE_URL

    @property
    def database_url_sync(self) -> str:
        return self.DATABASE_URL.replace("+asyncpg", "+psycopg2")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
