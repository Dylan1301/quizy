from typing import Union
from sqlalchemy import delete, true, update
from sqlmodel import Session, create_engine, select

from models.room import Room, RoomCreate, RoomList

def create_room(*, session: Session, teacher_id: Union[int, None], room_create_model: RoomCreate) -> Room:
    db_obj = Room.model_validate(room_create_model, update={"teacher_id": teacher_id})
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