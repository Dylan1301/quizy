from typing import List
from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select
from core.db.db import create_db_and_tables

from api.main import api_router

app = FastAPI()

origins = [
    "http://localhost",  # Whitelist localhost port 80
    "http://localhost:5173",  # Whitelist localhost port 80
    "http://yourdomain.com:80",  # Whitelist your domain with port 80
    # Add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    create_db_and_tables()

@app.get("/startup")
async def startup_event_2():
    create_db_and_tables()
    return "DB created"