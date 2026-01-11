from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.db.database import engine, Base
from app.core.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# CORS
origins = [
    "*", # Allow all for demo purposes/Vercel deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Ensure all tables (including new columns) exist or are migrated
    # For a simple SQLite deployment, we might need to run the migration script if the file exists but columns are missing
    # But for a fresh "cloud" start with no DB file, `Base.metadata.create_all` works.
    # If the DB file persists but schema changed, we need the migration script.
    from migrate_db import migrate
    try:
        migrate()
    except Exception as e:
        print(f"Migration warning: {e}")

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "AI Contract Intelligence Agent API is running"}
