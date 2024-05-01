from sqlmodel import create_engine, Session, select, SQLModel
from typing import Union, List
from models.room import RoomCreate, Room, RoomPublic, RoomList, RoomUpdate
from models.user import Student
from core.db.quiz import get_quiz_owner_id
import datetime

def create_room(*, session: Session, room_in: RoomCreate) -> Room:
    db_obj = Room.model_validate(room_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def get_room_list(*, session: Session, quiz_id: Union[int, None]) -> RoomList:
    # Not valid since no teacher_id found available in Room Model
    statement = (select(Room)
                 .where(Room.quiz_id == quiz_id))
    room_list = session.exec(statement).all()

    return RoomList(data=room_list)

def get_room_detail(*, session: Session, room_id: int) -> Union[Room, None]:
    statement = (select(Room)
                 .where(Room.id == room_id)
                 )
    room = session.exec(statement).first()
    return room

def edit_room(*, session: Session, room_id: int, room_edit: RoomUpdate):
    db_obj = Room.model_validate(room_edit, update={"id": room_id})
    statement = (select(Room)
                 .where(Room.id == room_id))
    room = session.exec(statement).one()

    room_edit_data = room_edit.model_dump(exclude_unset=True)
    room.sqlmodel_update(room_edit_data)
    session.add(room)
    session.commit()
    session.refresh(room)
    return room
    
def delete_room(*, session: Session, room_id: int):
    statement = (select(Room)
                 .where(Room.id == room_id)
    )

    room = session.exec(statement).first()
    session.delete(room)
    session.commit()

def publish_room(*, session: Session, room_id: int):
    statement = (select(Room)
                 .where(Room.id == room_id)
    )
    room = session.exec(statement).one()
    room.is_published = True
    session.add(room)
    session.commit()
    session.refresh(room)
    return room


def end_room(*, session: Session, room_id: int) -> Union[Room, None]:
    statement = (select(Room)
                .where(Room.id == room_id)
    )
    room = session.exec(statement).one()
    room.is_published = False
    room.ended_at = datetime.datetime.now(datetime.timezone.utc)
    session.add(room)
    session.commit()
    session.refresh(room)
    return room


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


def get_room_by_id(*, session:Session, room_id: int) -> Union[Room, None]:
    staetment = (select(Room)
                .where(Room.id == room_id)
                )
    room_out = session.exec(staetment).first()

    return room_out

def verify_room_owner(*, session: Session, room_id: int, teacher_id: int):
    room_obj = get_room_by_id(session=session, room_id=room_id)
    if room_obj: 
        return get_quiz_owner_id(session=session, quiz_id=room_obj.quiz_id, teacher_id=teacher_id)
    return False

def verify_student_in_room(*, session: Session, room_id: int, student_id: int):
    statement = (select(Student.id)
                .where(Student.id == student_id)
                .where(Student.room_id == room_id)
    )
    student = session.exec(statement).first()
    if student:
        return True
    
    return False
