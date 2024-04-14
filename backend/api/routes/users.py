from json import detect_encoding
from os import access
from typing import Annotated, Any, List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, col, delete, func, select
from api.deps import SessionDep, CurrentUserDep
from core.security import create_access_token, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
from models.user import Teacher, TeacherCreate, TeacherPassword, TeacherPublic, User, Token
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
    teacher =create_teacher(session=session, teacher_create=teacher_in)
    return teacher


@router.patch("/me/password")
def change_teacher_password(session:SessionDep, teacher_update: TeacherPassword, current_teacher:CurrentUserDep):
    old_password= teacher_update.current_password
    
    if not verify_password(old_password, current_teacher.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect previous Password")
    if teacher_update.current_password == teacher_update.new_password:
        raise HTTPException(status_code=400, detail="Please choose a new password")
    hashed_password=get_password_hash(teacher_update.new_password)
    current_teacher.hashed_password=hashed_password
    session.add(current_teacher)
    session.commit()

    return {"message":"Password changed complete"}


@router.get("/userss/", response_model=List[User])
async def read_users(session: SessionDep):
    statement = select(User)
    users = session.exec(statement).all()
    return users


# Move this to login route file
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta

@router.post("/login/token", response_model=Token)
def login_for_access_token(session: SessionDep, form: Annotated[OAuth2PasswordRequestForm, Depends()]):
    teacher = authenticate_teacher(session=session, email=form.username, password=form.password )

    if not teacher:
        raise HTTPException(status_code=400, detail="Incorrect password or email. Try again")

    time_delta= timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = create_access_token(subject=teacher.id, expires_delta=time_delta)

    return Token(access_token=token_data)

# Student login

