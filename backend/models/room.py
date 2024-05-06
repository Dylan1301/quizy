from typing import TYPE_CHECKING, Dict, List, Optional, Union
from sqlmodel import (
    Field,
    Relationship,
    SQLModel,
    Column,
    TIMESTAMP,
    text,
    FetchedValue,
)
from datetime import datetime

if TYPE_CHECKING:
    from models.user import Student
    from models.quiz import Quiz


class RoomBase(SQLModel):
    quiz_id: int
    name: str
    is_randomized: bool
    is_published: bool = False


class RoomCreate(RoomBase):
    pass


class Room(RoomBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    quiz_id: Optional[int] = Field(default=None, foreign_key="quiz.id")
    created_at: Union[datetime, None] = Field(
        default=None,
        sa_column=Column(
            TIMESTAMP(timezone=True),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP"),
        ),
    )
    updated_at: Union[datetime, None] = Field(
        default=None,
        sa_column=Column(
            TIMESTAMP(timezone=True),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP"),
            server_onupdate=FetchedValue(),
        ),
    )
    ended_at: Optional[datetime] = Field(
        default=None, sa_column=Column(TIMESTAMP(timezone=True))
    )
    is_published: bool
    is_randomized: bool
    students: List["Student"] = Relationship(back_populates="room")
    quiz: "Quiz" = Relationship(back_populates="rooms")


class RoomList(SQLModel):
    data: list[Room]


class RoomUpdate(SQLModel):
    name: Optional[str]
    is_randomized: Optional[bool]
    is_published: Optional[bool]


class RoomPublic(RoomBase):
    id: int
    created_at: datetime
    updated_at: datetime
    ended_at: Optional[datetime]

class RoomStat(SQLModel):
    room_id: int
    room_stat: Dict[Student, int]