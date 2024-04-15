from ctypes import Union
import secrets
from xml.dom import ValidationErr
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from models.user import TeacherPublic, Teacher, TokenPayload
from core.db import engine
from collections.abc import Generator
from typing import Annotated
from core.security import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/token")

def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]

async def get_current_teacher(*, session: SessionDep, token: TokenDep) -> Teacher:
    try:
        payload=jwt.decode(token, key = SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationErr):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )


    teacher= session.get(Teacher, token_data.sub)

    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    return teacher


CurrentUserDep= Annotated[Teacher, Depends(get_current_teacher)]