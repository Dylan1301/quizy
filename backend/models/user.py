from typing import Optional
from sqlmodel import SQLModel
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(...)
    email: str = Field(...)
    hashed_password: str = Field(...)
