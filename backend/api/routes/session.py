from fastapi import APIRouter, HTTPException
from requests import Session
from api.deps import SessionDep, CurrentUserDep
from models.question import QuestionPublic, QuestionReponsePublic, QuestionResponseCreate, QuestionsPublic
from core.db.quiz import get_quiz_owner_id
from models.quiz import Quiz
from models.user import StudentPublic
from models.session import QuizSession, RoomSession


router = APIRouter()


@router.get("/room/{room_id}/quiz", response_model=QuizSession)
def get_room_random_quiz(session:SessionDep, student_in: StudentPublic):
    """
    Return QuizzesSession  - Quiz contain list of quiz in different
    Params:
        session: SQL session
        student_in: Student information => To ensure student is already in the room
    """

    return QuizSession


@router.post("room/{room_id}/start_quiz", response_model=RoomSession)
def start_room_quiz(session: SessionDep, teacher: CurrentUserDep):
    """
    Return: RoomSession - Room info with the random questions list
    Params:
        session: SQL session
        Teacher: Teacher Info => ensure teacher is room owner
    """
    # get_quiz_owner_id()
    # DB function: Verify room owner 
    # Db function: Get room and quizquestionsanswers information from the DB
    #   Randomnizing question function  - return questions order list
    # DB function for getting questions in questions order list

    return RoomSession

@router.post("room/{room_id}/next_question")
def start_next_ques(session: SessionDep, teacher: CurrentUserDep, question_in: QuestionPublic):
    """
    Teacher move to next question
    """
    pass

@router.post("room/{room_id}/end_session")
def end_room_quiz(session:SessionDep, teacher: CurrentUserDep):
    """
    End the current room session and return statistics of all user
    """
    pass

@router.post("room/{room_id}/answer", response_model=QuestionReponsePublic)
def submit_question_response(session: SessionDep, student: StudentPublic, question: QuestionResponseCreate):
    """
    Return: QuestionResponsePublic models
    """
    pass

@router.post("room/{room_id}/stats")
def get_room_stats(session: SessionDep, student: StudentPublic):
    """
    Get statistics for the whole group
    """
    pass