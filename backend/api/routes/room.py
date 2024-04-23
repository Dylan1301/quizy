from typing import Union
from click import edit
from fastapi import APIRouter, HTTPException
from requests import Session
from api.deps import CurrentUserDep, SessionDep
from models.room import Room, RoomCreate, RoomList
from models.user import Student, StudentBase, StudentPublic, StudentRegister
from core.db.db import create_student, get_student
from core.db import room


router = APIRouter()

# Add room verifying function once started
# student join the room


@router.post("/join/room/{room_id}", response_model=StudentPublic)
def student_join_room(session: SessionDep, room_id: str, student_in: StudentRegister):

    # Add room verify
    student = create_student(session=session, student_in=student_in)
    return student

@router.post("/room/create", response_model=Room)
def room_create(session: SessionDep, teacher: CurrentUserDep, room_create_model: RoomCreate):
    response = room.create_room(
        session=session, teacher_id=teacher.id, room_create_model=room_create_model)
    return response

@router.get("/room/list", response_model=RoomList)
def room_list(session: SessionDep, teacher: CurrentUserDep):
    response = room.get_room_list(session=session, teacher_id=teacher.id)
    return response

@router.get("/room/detail/{room_id}", response_model=Room)
def room_detail(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = room.get_room_detail(session=session, teacher_id=teacher.id, room_id=room_id)
    return response

@router.post("/room/edit/{room_id}", response_model=RoomCreate)
def room_edit(session: SessionDep, teacher: CurrentUserDep, room_id: int, room_edit_model: Room):
    response = room.edit_room(session=session, teacher_id=teacher.id, room_id=room_id, room_edit=room_edit_model)
    return response

@router.post("/room/delete/{room_id}", response_model=RoomCreate)
def room_delete(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = room.delete_room(session=session, teacher_id=teacher.id, room_id=room_id)
    return response

@router.post("/room/publish/{room_id}", response_model=RoomCreate)
def room_publish(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = room.publish_room(session=session, teacher_id=teacher.id, room_id=room_id)
    return response

@router.post("/room/start/{room_id}", response_model=RoomCreate)
def room_start(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = room.start_room(session=session, teacher_id=teacher.id, room_id=room_id)
    return response