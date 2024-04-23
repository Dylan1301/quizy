import email
from typing import Optional, Union, List, TYPE_CHECKING
from sqlalchemy import Boolean, table
from sqlmodel import Field, SQLModel, Column, TIMESTAMP, text, FetchedValue, Relationship
from datetime import datetime
from models.answer import Answer, AnswerCreate
if TYPE_CHECKING:     
    from models.quiz import Quiz
    from models.user import Student
    from models.answer import Answer

class QuestionBase(SQLModel):
    tilte: str
    # quiz_id: Optional[int]
    explaination: str
    type: Optional[str]
    time_limit: Optional[int]

class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
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
    quiz_id: Optional[int] = Field(default=None,
                                   foreign_key="quiz.id"
                                   )
    quiz: Optional["Quiz"] = Relationship(back_populates="questions")
    answers: List["Answer"] = Relationship(back_populates="question")

class QuestionPublic(QuestionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    

class QuestionsPublic(SQLModel):
    data: List[QuestionPublic]

class QuestionAnswer(QuestionPublic):
    answers: List[Answer]

class QuestionAnswerCreate(QuestionCreate):
    answers: List[AnswerCreate]

# Question Response Class


class QuestionReponseBase(SQLModel):
    student_id: Optional[int]
    room_id: Optional[int]
    question_id: Optional[int]
    answer_id: Optional[int]


class QuestionResponseCreate(QuestionReponseBase):
    pass


class QuestionResponse(QuestionReponseBase, table=True):
    id: Optional[int] = Field(default=None,
                              primary_key=True
                              )
    student_id: Optional[int] = Field(default=None,
                                      foreign_key="student.id")
    room_id: Optional[int] = Field(default=None,
                                   foreign_key="room.id")
    question_id: Optional[int] = Field(default=None,
                                       foreign_key="question.id")
    answer_id: Optional[int] = Field(default=None,
                                     foreign_key="answer.id")
    created_at: Union[datetime, None] = Field(default=None,
                                              sa_column=Column(TIMESTAMP(timezone=True),
                                                               nullable=False, server_default=text("CURRENT_TIMESTAMP"))
                                              )
    total_time_taken: Optional[int]= Field(...)
    student: Optional["Student"] = Relationship(back_populates="question_reponses")

class QuestionReponsePublic(QuestionReponseBase):
    id: int
    student_id: int
    room_id: int
    question_id: int
    answer_id: int
    created_at: datetime
    total_time_taken: int