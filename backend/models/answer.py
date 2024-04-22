import email
from typing import TYPE_CHECKING, List, Optional, Union
from sqlalchemy import Boolean, table
from sqlmodel import Field, Relationship, SQLModel, Column, TIMESTAMP, text, FetchedValue
from datetime import datetime

if TYPE_CHECKING:
    from models.question import Question, QuestionResponse


class AnswerBase(SQLModel):
    content: str
    is_correct: bool
    # question_id: Optional[int]


class AnswerCreate(AnswerBase):
    pass


class Answer(AnswerBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question_id: Optional[int] = Field(default=None,
                                   foreign_key="question.id"
                                   )
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
    question: Optional["Question"] = Relationship(back_populates="answers")

class AnswerPublic(AnswerBase):
    created_at: datetime
    updated_at: datetime
