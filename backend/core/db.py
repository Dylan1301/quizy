from sqlmodel import create_engine, Session, select
from models.user import Teacher, TeacherCreate, TeacherPublic
from core.security import get_password_hash, verify_password
from typing import Union

# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydatabase"
DATABASE_URL = "postgresql://postgres:postgres@db/mydatabase"
engine = create_engine(DATABASE_URL)

# Include DB Crud actions

def create_teacher(*, session:Session, teacher_create: TeacherCreate) -> Teacher:
    db_obj = Teacher.model_validate(teacher_create, update={
        "hashed_password": get_password_hash(teacher_create.password)
    })
    
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def get_teacher_by_email(*, session:Session, email:str) -> Union[Teacher, None]:
    statement= select(Teacher).where(Teacher.email==email)
    session_teacher= session.exec(statement).first()
    return session_teacher


def authenticate_teacher(*, session:Session, email:str, password: str) -> Union[Teacher, None]:
    teacher = get_teacher_by_email(session=session, email=email)
    if not teacher:
        return None
    if not verify_password(password, hashed_password=teacher.hashed_password):
        return None
    return teacher

