from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.router import api_router
from backend.app.db.init_db import create_all_tables, verify_database_connection


create_all_tables()

app = FastAPI(title="ATHLETIQ API", version="0.1.0")


@app.on_event("startup")
def startup_event() -> None:
    create_all_tables()
    verify_database_connection()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8443", "http://localhost:8443"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(api_router)
