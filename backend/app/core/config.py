import os
import secrets
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[3] / ".env")

DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql+psycopg://athletiq:change_me@localhost:5432/athletiq"
JWT_SECRET = os.getenv("JWT_SECRET") or os.getenv("ATHLETIQ_JWT_SECRET") or secrets.token_urlsafe(32)
