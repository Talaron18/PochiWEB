from pydantic import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    SILICONFLOW_API_KEY: str
    IMAGE2TEXT_API_URL: str
    IMG2TEXT_MODEL: str
    GLM_API_KEY: str
    GLM_API_URL: str
    GLM_MODEL: str
    STABILITY_API_KEY: str
    STABILITY_API_URL: str
    STABILITY_MODEL: str


    class Config:
        env_file = Path(__file__).resolve().parent.parent / ".env"
settings = Settings()