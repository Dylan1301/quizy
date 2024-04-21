from typing import Annotated, Any, List, Union
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from api.deps import SessionDep, CurrentUserDep
from core.security import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from jose import JWTError, jwt
from core.db.db import authenticate_teacher
from models.user import Token

router = APIRouter()


@router.post("/login/token", response_model=Token)
def login_for_access_token(session: SessionDep, form: Annotated[OAuth2PasswordRequestForm, Depends()]):
    teacher = authenticate_teacher(
        session=session, email=form.username, password=form.password)

    if not teacher:
        raise HTTPException(
            status_code=400, detail="Incorrect password or email. Try again")

    time_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = create_access_token(
        subject=teacher.id, expires_delta=time_delta)

    return Token(access_token=token_data)
