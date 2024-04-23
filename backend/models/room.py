import email
from typing import TYPE_CHECKING, List, Optional, Union
from sqlalchemy import Boolean, table
from sqlmodel import Field, Relationship, SQLModel, Column, TIMESTAMP, text, FetchedValue
from datetime import datetime
if TYPE_CHECKING:
    from models.user import Student
    from models.quiz import Quiz


class RoomBase(SQLModel):
    quiz_id: int
    name: str
    is_published: bool


class RoomCreate(RoomBase):
    pass


class Room(RoomBase, table=True):
    id: Optional[int] = Field(default=None,
                              primary_key=True)
    quiz_id: Optional[int] = Field(default=None,
                                   foreign_key="quiz.id")
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
    ended_at: Union[datetime, None] = Field(default=None,
                                            sa_column=Column(TIMESTAMP(timezone=True)))
    is_published: bool
    students: List["Student"] = Relationship(back_populates="room")
    quiz: Optional["Quiz"] = Relationship(back_populates="rooms")


class RoomPublic(RoomBase):
    id: int
    created_at: datetime
    updated_at: datetime
    ended_at: datetime
