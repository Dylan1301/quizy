from typing import Any
from fastapi import APIRouter
from api.deps import SessionDep, CurrentUserDep
from models.quiz import (
    QuizCreate,
    QuizPublic,
    QuizQuestions,
    QuizQuestionsCreate,
    QuizzesPublic,
)
from core.db.quiz import get_quizzes, create_quiz, get_quiz, create_quiz_questions


router = APIRouter()


@router.get("/quizzes", response_model=QuizzesPublic)
def get_all_quiz(
    session: SessionDep, teacher: CurrentUserDep, skip: int = 0, limit: int = 100
) -> Any:
    """
    Get all quiz related to the current teacher
    Return: list of quizzes that created by the current user
    """
    response = get_quizzes(
        session=session, teacher_id=teacher.id, skip=skip, limit=limit
    )
    return response


@router.post("/quiz", response_model=QuizPublic)
def create_quiz_id(session: SessionDep, teacher: CurrentUserDep, quiz_in: QuizCreate):
    """
    Create a quiz
    Param: quiz_in: QuizCreate Object contain information needed to create a quiz
    Return:  quiz with information
    """
    quiz_out = create_quiz(session=session, quiz_in=quiz_in, teacher_id=teacher.id)
    return quiz_out


@router.get("/quiz/{quiz_id}", response_model=QuizQuestions)
def get_quiz_questions(session: SessionDep, teacher: CurrentUserDep, quiz_id: int):
    """
    Get a quiz by it ID
    Param: quiz_id: id of quiz
    Return:  QuizQuestions object - contain quiz and related questions information.
    """
    quiz_out = get_quiz(session=session, quiz_id=quiz_id, teacher_id=teacher.id)
    return quiz_out


@router.post("/quiz_ver2", response_model=QuizQuestions)
def create_quiz_questions_api(
    session: SessionDep, teacher: CurrentUserDep, quiz_in: QuizQuestionsCreate
):
    """
    Create a quiz with list of questions and answers. This is an another version of quiz
    Param: quiz_in: QuizCreate Object contain information needed to create a quiz
    Return:  quiz with questions and answers
    """

    return create_quiz_questions(
        session=session, teacher_id=teacher.id, quiz_in=quiz_in
    )


@router.patch("/quiz/{quiz_id}", response_model=QuizQuestions)
def update_quiz_questions(session: SessionDep, teacher: CurrentUserDep, quiz_id):
    pass
