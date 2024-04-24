from sqlmodel import create_engine, Session, select, SQLModel
from typing import Union, List
from models.room import RoomCreate, Room, RoomPublic, RoomList
from core.db.quiz import get_quiz_owner_id

def create_room(*, session: Session, room_in: RoomCreate) -> Room:
    db_obj = Room.model_validate(room_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def get_room_list(*, session: Session, teacher_id: Union[int, None]) -> RoomList:
    statement = (select(Room)
                 .where(Room.teacher_id == teacher_id))
    room_list = session.exec(statement).all()

    return RoomList(data=room_list)

def get_room_detail(*, session: Session, teacher_id: Union[int, None], room_id: int) -> Room:
    statement = (select(Room)
                 .where(Room.teacher_id == teacher_id)
                 .where(Room.id == room_id)
                 )
    room = session.exec(statement).one()
    return room

def edit_room(*, session: Session, teacher_id: Union[int, None], room_id: int, room_edit: Room):
    db_obj = Room.model_validate(room_edit, update={"teacher_id": teacher_id})
    statement = (select(Room)
                 .where(Room.teacher_id == teacher_id)
                 .where(Room.id == room_id))
    room: Room = session.exec(statement).one()
    room.name = db_obj.name
    session.add(room)
    session.commit()
    
def delete_room(*, session: Session, teacher_id: Union[int, None], room_id: int):
    statement = (select(Room)
                 .where(Room.teacher_id == teacher_id)
                 .where(Room.id == room_id)
    )
    session.delete(statement)
    session.commit()

def publish_room(*, session: Session, teacher_id: Union[int, None], room_id: int):
    statement = (select(Room)
                 .where(Room.teacher_id == teacher_id)
                 .where(Room.id == room_id)
    )
    room = session.exec(statement).one()
    room.is_published = True
    session.add(room)
    session.commit()


def start_room(*, session: Session, teacher_id: Union[int, None], room_id: int):
    statement = (select(Room)
                 .where(Room.teacher_id == teacher_id)
                 .where(Room.id == room_id)
    )
    room = session.exec(statement).one()
    pass

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




