from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # ✅ Database
    DATABASE_URL: str

    # ✅ Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# ✅ Singleton instance
settings = Settings()
