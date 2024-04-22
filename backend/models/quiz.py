import email
from typing import Optional, Union, List, TYPE_CHECKING
from sqlalchemy import table
from sqlmodel import Field, Relationship, SQLModel, Column, TIMESTAMP, text, FetchedValue
from datetime import datetime
from models.question import QuestionAnswer, QuestionsPublic, Question, QuestionAnswerCreate


if TYPE_CHECKING:
    from models.user import Teacher
    from models.question import Question, QuestionsPublic
    from models.room import Room


class QuizBase(SQLModel):
    tilte: str = Field(...)
    description: str = Field(...)


class QuizCreate(QuizBase):
    pass


class Quiz(QuizBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    teacher_id: Optional[int] = Field(default=None, foreign_key="teacher.id")
    created_at: Union[datetime, None] = Field(default=None,
                                              sa_column=Column(TIMESTAMP(timezone=True),
                                                               nullable=False, server_default=text("CURRENT_TIMESTAMP"))
                                              )
    updated_at: Union[datetime, None] = Field(default=None,
                                              sa_column=Column(TIMESTAMP(timezone=True),
                                                               nullable=False,
                                                               server_default=text(
                                                                   "CURRENT_TIMESTAMP"),
                                                               server_onupdate=FetchedValue(),
                                                               )
                                              )
    teacher: Optional["Teacher"] = Relationship(back_populates="quizzes")
    questions: List["Question"] = Relationship(back_populates="quiz")
    rooms: List["Room"] = Relationship(back_populates="quiz")


class QuizUpdate(QuizBase):
    id: int


class QuizPublic(QuizBase):
    id: int
    teacher_id: int
    created_at: datetime
    updated_at: datetime


class QuizzesPublic(SQLModel):
    data: List[Quiz]


class QuizQuestions(QuizPublic):
    questions: List[QuestionAnswer]


class QuizQuestionsCreate(QuizCreate):
    questions: List[QuestionAnswerCreate]
