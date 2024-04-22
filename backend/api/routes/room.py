from typing import Union
from fastapi import APIRouter, HTTPException
from api.deps import SessionDep
from models.user import Student, StudentBase, StudentPublic, StudentRegister
from core.db.db import create_student, get_student


router = APIRouter()

# Add room verifying function once started
# student join the room


@router.post("/join/room/{room_id}", response_model=StudentPublic)
def student_join_room(session: SessionDep, room_id: str, student_in: StudentRegister):

    # Add room verify
    student = create_student(session=session, student_in=student_in)
    return student
