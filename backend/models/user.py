from typing import Optional, Union, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Column, TIMESTAMP, text, Relationship
from datetime import datetime
from models.quiz import Quiz
from models.room import Room

if TYPE_CHECKING:
    from models.room import Room
    from models.quiz import Quiz
    from models.question import QuestionResponse


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(...)
    email: str = Field(...)
    hashed_password: str = Field(...)


class TeacherBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str = Field(...)
    google_id: Union[str, None] = None


class TeacherCreate(TeacherBase):
    password: str


# Teacher model and table inside database
class Teacher(TeacherBase, table=True):
    id: int = Field(default=None, primary_key=True)
    hashed_password: str
    token: Union[str, None] = Field(default=None)
    quizzes: List[Quiz] = Relationship(back_populates="teacher")


# Class for return Teacher information when request by API
class TeacherPublic(TeacherBase):
    id: int


# Use for updating Teacher info or password
class TeacherUpdateInfo(SQLModel):
    name: Union[str, None] = None
    email: Union[str, None] = None


class TeacherLogin(SQLModel):
    email: str
    password: str


class TeacherPassword(SQLModel):
    current_password: str
    new_password: str


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

# Student class


class StudentBase(SQLModel):
    room_id: int
    name: str


class Student(StudentBase, table=True):
    id: int = Field(default=None, primary_key=True)
    created_at: Union[datetime, None] = Field(default=None,
                                              sa_column=Column(TIMESTAMP(timezone=True),
                                                               nullable=False, server_default=text("CURRENT_TIMESTAMP"))
                                              )
    question_reponses: List["QuestionResponse"] = Relationship(
        back_populates="student")
    room_id: Optional[int] = Field(default=None, foreign_key="room.id")
    room: Optional[Room] = Relationship(back_populates="students")


class StudentRegister(StudentBase):
    pass


class StudentPublic(StudentBase):
    id: int


class StudentList(SQLModel):
    data: list[Student]