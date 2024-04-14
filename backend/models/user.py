import email
from typing import Optional, Union
from sqlmodel import SQLModel
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(...)
    email: str = Field(...)
    hashed_password: str = Field(...)



class TeacherBase(SQLModel):
    email: str= Field(unique=True, index=True)
    name: str= Field(...)
    google_id: Union[str, None] = None


class TeacherCreate(TeacherBase):
    password: str


# Teacher model and table inside database
class Teacher(TeacherBase, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    hashed_password: str
    token: Union[str, None] =  Field(default=None)


# Class for return Teacher information when request by API
class TeacherPublic(TeacherBase):
    id: int


# Use for updating Teacher info or password
class TeacherUpdateInfo(SQLModel):
    name: Union[str, None] = None
    email: Union[str, None] = None


class TeacherPassword(SQLModel):
    current_password: str
    new_password: str


# Student class

class StudentBase(SQLModel):
    room_id: str = Field(...)
    name: str


# Research more abt this

# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: Union[int, None] = None


class NewPassword(SQLModel):
    token: str
    new_password: str


