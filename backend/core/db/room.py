from sqlmodel import create_engine, Session, select, SQLModel
from typing import Union, List
from models.room import RoomCreate, Room, RoomPublic

def create_room(*, session: Session, room_in: RoomCreate) -> Room:
    db_obj = Room.model_validate(room_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_room_student(*, session:Session, room_id: int) -> Union[Room, None]:
    staetment = (select(Room)
                 .where(Room.id == room_id)
                 .where(Room.is_published)
                 )
    room_out = session.exec(staetment).first()
    return room_out


def get_room(*, session:Session, room_id: int, quiz_id: int) -> Union[Room, None]:
    staetment = (select(Room)
                 .where(Room.id == room_id)
                 .where(Room.quiz_id == quiz_id)
                 )
    room_out = session.exec(staetment).first()

    return room_out

def get_rooms(*, session:Session, quiz_id: int) -> List[Room]:
    staetment = (select(Room)
                 .where(Room.quiz_id == quiz_id)
                 )
    room_out = session.exec(staetment).all()

    return room_out


