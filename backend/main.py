from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select
from models.user import User

app = FastAPI()

origins = [
    "http://localhost",  # Whitelist localhost port 80
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

# Use the hostname "db" to connect to the PostgreSQL Docker container
DATABASE_URL = "postgresql://postgres:postgres@db/mydatabase"
engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    with Session(engine):
        SQLModel.metadata.create_all(engine)


@app.post(
    "/users/",
    summary="Create a new user",
    description="This endpoint creates a new user with the given details.",
)
async def create_user(user: User):
    """
    Create a new user in the system.

    Args:
        user (User): The user to be created.

    Returns:
        User: The created user.
    """
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


@app.get("/users/", response_model=List[User])
async def read_users():
    with Session(engine) as session:
        statement = select(User)
        users = session.exec(statement).all()
        return users


@app.get("/users/{user_id}")
async def read_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        return user


@app.put("/users/{user_id}")
async def update_user(user_id: int, user: User):
    with Session(engine) as session:
        db_user = session.get(User, user_id)
        if db_user is None:
            return {"message": "User not found"}
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
