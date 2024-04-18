from json import detect_encoding
from os import access
from fastapi import APIRouter, Cookie, Depends, HTTPException, Query
from api.deps import SessionDep, CurrentUserDep
from core.security import create_access_token, verify_password
from models.user import StudentRegister, Teacher, TeacherCreate, TeacherPassword, TeacherPublic
from core.db import authenticate_teacher, get_teacher_by_email, get_password_hash, create_teacher

router = APIRouter()


@router.get("/me/info", response_model=TeacherPublic)
def read_teacher(session: SessionDep, current_teacher: CurrentUserDep):

    return current_teacher


@router.post("/signup", response_model=TeacherPublic)
async def register_teacher(teacher_in: TeacherCreate, session: SessionDep):
    teacher = get_teacher_by_email(session=session, email=teacher_in.email)
    if teacher:
        raise HTTPException(
            status_code=400,
            detail="Email already exist in the system, please choose another email"
        )

    # new_teacher= TeacherCreate.model_validate(teacher_in)
    teacher = create_teacher(session=session, teacher_create=teacher_in)
    return teacher


@router.patch("/me/password")
def change_teacher_password(session: SessionDep, teacher_update: TeacherPassword, current_teacher: CurrentUserDep):
    old_password = teacher_update.current_password

    if not verify_password(old_password, current_teacher.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect previous Password")
    if teacher_update.current_password == teacher_update.new_password:
        raise HTTPException(
            status_code=400, detail="Please choose a new password")
    hashed_password = get_password_hash(teacher_update.new_password)
    current_teacher.hashed_password = hashed_password
    session.add(current_teacher)
    session.commit()

    return {"message": "Password changed complete"}
