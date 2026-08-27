from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Contract Intelligence Agent"
    API_V1_STR: str = "/api/v1"
    
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    # Kept optional so an existing .env with only CEREBRAS_API_KEY still loads.
    CEREBRAS_API_KEY: Optional[str] = None
    
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENV: Optional[str] = None
    PINECONE_INDEX_NAME: str = "ai-intelligent-contract-agent"
    
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
