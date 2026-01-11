from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Contract Intelligence Agent"
    API_V1_STR: str = "/api/v1"
    
    CEREBRAS_API_KEY: str
    
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENV: Optional[str] = None
    PINECONE_INDEX_NAME: str = "ai-intelligent-contract-agent"
    
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()
