from typing import Union
from wsgiref import validate
from click import edit
from fastapi import APIRouter, HTTPException
from requests import Session
from api.deps import CurrentUserDep, SessionDep
from models.room import Room, RoomCreate, RoomList, RoomPublic, RoomUpdate
from models.user import Student, StudentBase, StudentPublic, StudentRegister
from core.db.db import create_student, get_student
from core.db.room import create_room, get_room_detail, get_room, publish_room, delete_room, get_room_list, edit_room, verify_room_owner, end_room
from core.db.quiz import get_quiz_owner_id

router = APIRouter()

# Add room verifying function once started
# student join the room


@router.post("/room", response_model=Room)
def room_create(session: SessionDep, teacher: CurrentUserDep, room_create_model: RoomCreate):
    """
    Create room if the teacher has sign in
    """
    validate = get_quiz_owner_id(
        session=session, quiz_id=room_create_model.quiz_id, teacher_id=teacher.id)

    if not validate:
        raise HTTPException(
            status_code=400, detail="Quiz not found for the user")
    response = create_room(session=session, room_in=room_create_model)

    return response


@router.get("/room/list", response_model=RoomList)
def room_list(session: SessionDep, teacher: CurrentUserDep, quiz_id: int):

    validate = get_quiz_owner_id(
        session=session, quiz_id=quiz_id, teacher_id=teacher.id)

    if not validate:
        raise HTTPException(
            status_code=400, detail="Quiz not found for the user")

    response = get_room_list(session=session, quiz_id=quiz_id)
    return response


@router.get("/room/{room_id}", response_model=Room)
def room_detail(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    """
    For teacher getting room detail
    """
    room_out = get_room_detail(
        session=session, room_id=room_id)

    if not room_out:
        raise HTTPException(status_code=400, detail="Room is not available")

    validate = get_quiz_owner_id(
        session=session, quiz_id=room_out.quiz_id, teacher_id=teacher.id)

    if not validate and not room_out.is_published:
        raise HTTPException(
            status_code=400, detail="You are not owner of this room")
    return room_out

@router.get("/room/{room_id}/public", response_model=RoomPublic)
def room_public_detail(session: SessionDep, room_id: int):
    """
    For public/non login user to get room information. Only work if room is published

    """
    room_out = get_room_detail(
        session=session, room_id=room_id)
    
    if not room_out or not room_out.is_published:
        raise HTTPException(status_code=400, detail="Room is not available")
    
    return room_out

@router.put("/room/{room_id}", response_model=Room)
def room_edit(session: SessionDep, teacher: CurrentUserDep, room_id: int, room_edit_model: RoomUpdate):
    """
    Edit a room information
    """
    if not verify_room_owner(session=session, room_id=room_id, teacher_id=teacher.id):
        raise HTTPException(
            status_code=400, detail="You are not owner of this room or room not available")
    response = edit_room(session=session,
                         room_id=room_id, room_edit=room_edit_model)
    return response


@router.delete("/room/{room_id}")
def room_delete(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    """
    Delete a room based on room_id
    """

    if not verify_room_owner(session=session, room_id=room_id, teacher_id=teacher.id):
        raise HTTPException(
            status_code=400, detail="You are not owner of this room or room not available")
    response = delete_room(
        session=session, room_id=room_id)
    return "Success"


@router.post("/room/{room_id}/publish", response_model=RoomCreate)
def room_publish(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    """
    Publish the room if user is room owner.
    """
    if not verify_room_owner(session=session, room_id=room_id, teacher_id=teacher.id):
        raise HTTPException(
            status_code=400, detail="You are not owner of this room or room not available")
    response = publish_room(
        session=session, room_id=room_id)
    return response


@router.post("/room/{room_id}/end", response_model=RoomPublic)
def room_end(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    """
    End the room if user is room owner
    """

    if not verify_room_owner(session=session, room_id=room_id, teacher_id=teacher.id):
        raise HTTPException(
            status_code=400, detail="You are not owner of this room or room not available")
    room_out = end_room(session=session, room_id=room_id)
    return room_out

