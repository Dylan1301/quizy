from typing import Union
from wsgiref import validate
from click import edit
from fastapi import APIRouter, HTTPException
from requests import Session
from api.deps import CurrentUserDep, SessionDep
from models.room import Room, RoomCreate, RoomList
from models.user import Student, StudentBase, StudentPublic, StudentRegister
from core.db.db import create_student, get_student
from core.db.room import create_room, get_room_detail, get_room, start_room, publish_room, delete_room, get_room_list, edit_room, test_room
from core.db.quiz import get_quiz_owner_id

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

    validate = get_quiz_owner_id(
        session=session, quiz_id=room_create_model.quiz_id, teacher_id=teacher.id)

    if not validate:
        raise HTTPException(status_code=400, detail="Quiz not found for the user")
    response = create_room(session=session, room_in=room_create_model)

    return response


@router.get("/room/list", response_model=RoomList)
def room_list(session: SessionDep, teacher: CurrentUserDep):

    response = get_room_list(session=session, teacher_id=teacher.id)
    return response


@router.get("/room/detail/{room_id}", response_model=Room)
def room_detail(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = get_room_detail(
        session=session, teacher_id=teacher.id, room_id=room_id)
    return response


@router.post("/room/edit/{room_id}", response_model=RoomCreate)
def room_edit(session: SessionDep, teacher: CurrentUserDep, room_id: int, room_edit_model: Room):
    response = edit_room(session=session, teacher_id=teacher.id,
                         room_id=room_id, room_edit=room_edit_model)
    return response


@router.post("/room/delete/{room_id}", response_model=RoomCreate)
def room_delete(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = delete_room(
        session=session, teacher_id=teacher.id, room_id=room_id)
    return response


@router.post("/room/publish/{room_id}", response_model=RoomCreate)
def room_publish(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = publish_room(
        session=session, teacher_id=teacher.id, room_id=room_id)
    return response


@router.post("/room/start/{room_id}", response_model=RoomCreate)
def room_start(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    response = start_room(
        session=session, teacher_id=teacher.id, room_id=room_id)
    return response