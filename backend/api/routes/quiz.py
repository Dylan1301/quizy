from typing import Any
from fastapi import APIRouter, Cookie, Depends, HTTPException, Query
from requests import Session
from api.deps import SessionDep, CurrentUserDep
from core.security import create_access_token, verify_password
from models.quiz import Quiz, QuizCreate, QuizPublic, QuizQuestions, QuizQuestionsCreate, QuizzesPublic
from core.db.db import authenticate_teacher, get_teacher_by_email, get_password_hash, create_teacher
from core.db.quiz import get_quizzes, create_quiz, get_quiz, create_quiz_questions
from models.room import Room
from models.question import Question, QuestionResponse
from models.answer import Answer


router = APIRouter()


@router.get("/quizzes", response_model=QuizzesPublic)
def get_all_quiz(session: SessionDep, teacher: CurrentUserDep, skip: int = 0, limit: int = 100) -> Any:
    response = get_quizzes(
        session=session, teacher_id=teacher.id, skip=skip, limit=limit)
    return response


@router.post("/quiz", response_model=QuizPublic)
def create_quiz_id(session: SessionDep, teacher: CurrentUserDep, quiz_in: QuizCreate):
    quiz_out = create_quiz(
        session=session, quiz_in=quiz_in, teacher_id=teacher.id)
    return quiz_out


@router.get("/quiz/{quiz_id}", response_model=QuizQuestions)
def get_quiz_questions(session: SessionDep, teacher: CurrentUserDep, quiz_id: int):
    quiz_out = get_quiz(session=session, quiz_id=quiz_id,
                        teacher_id=teacher.id)
    return quiz_out


@router.post("/quiz_ver2", response_model=QuizQuestions)
def create_quiz_questions_api(session: SessionDep, teacher: CurrentUserDep, quiz_in: QuizQuestionsCreate):
    return create_quiz_questions(session=session, teacher_id=teacher.id, quiz_in=quiz_in)
