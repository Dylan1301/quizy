from typing import Optional
from fastapi import FastAPI
from sqlmodel import SQLModel, Session, create_engine
from models.user import User

app = FastAPI()

# Use the hostname "db" to connect to the PostgreSQL Docker container
DATABASE_URL = "postgresql://postgres:postgres@db/mydatabase"
engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    with Session(engine) as session:
        SQLModel.metadata.create_all(engine)


@app.post("/users/")
async def create_user(user: User):
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


@app.get("/users/{user_id}")
async def read_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        return user


@app.put("/users/{user_id}")
async def update_user(user_id: int, user: User):
    with Session(engine) as session:
        db_user = session.get(User, user_id)
        db_user.username = user.username
        db_user.email = user.email
        db_user.hashed_password = user.hashed_password
        session.commit()
        return db_user


@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        session.delete(user)
        session.commit()
        return {"message": "User deleted"}


@app.on_event("startup")
async def startup_event():
    create_db_and_tables()
