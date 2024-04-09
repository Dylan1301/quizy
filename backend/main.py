from fastapi import FastAPI
from sqlmodel import SQLModel, Session, create_engine

app = FastAPI()

# Use the hostname "db" to connect to the PostgreSQL Docker container
DATABASE_URL = "postgresql://postgres:postgres@db/mydatabase"
engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    with Session(engine) as session:
        SQLModel.metadata.create_all(engine)


@app.on_event("startup")
async def startup_event():
    create_db_and_tables()
