import email
from typing import TYPE_CHECKING, List, Optional, Union
from sqlalchemy import Boolean, table
from sqlmodel import Field, Relationship, SQLModel, Column, TIMESTAMP, text, FetchedValue
from datetime import datetime

from models.quiz import QuizQuestions
from models.room import RoomPublic
if TYPE_CHECKING:
    from models.user import Student
    from models.quiz import Quiz, QuizPublic
    from models.room import Room



# This will be used when teacher start the room and student request to get RoomSession Details

class QuizSession(QuizQuestions):
    """
    Class create for returning quiz with randomnizing orders
    """
    pass

class RoomSession(RoomPublic):
    quiz: QuizQuestions


