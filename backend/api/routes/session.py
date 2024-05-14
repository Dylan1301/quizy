from ast import Raise
from typing import Union, Annotated

from fastapi import APIRouter, HTTPException, Header
from api.deps import SessionDep, CurrentUserDep
from core.db.room import (
    get_room_by_id,
    get_student_in_room,
    verify_room_owner,
    verify_student_in_room,
    get_room_student,
)
from core.db.question import create_question_response
from core.db.db import create_student
from core.db.quiz import get_quiz


from models.question import QuestionReponsePublic, QuestionResponseCreate
from models.user import StudentList, StudentPublic, StudentRegister
from core.loader import QuizLoader, LoaderQuizData, LoaderQuestionData
from contextlib import asynccontextmanager
from datetime import datetime

from models.endroom import EndRoomBody 
from core.db.endroom import create_end_room_body

function_dict = {"quiz_loader": QuizLoader()}
quiz_loader = function_dict["quiz_loader"]


@asynccontextmanager
async def lifespan(app: APIRouter):
    function_dict["quiz_loader"] = QuizLoader()
    yield

    function_dict.clear()


router = APIRouter(lifespan=lifespan)


@router.get("/room/{room_id}/info", response_model=LoaderQuizData)
async def get_room_info(room_id: int):
    """
    Return QuizzesSession  - Quiz contain list of quiz in different
    Params:
        session: SQL session
        student_in: Student information => To ensure student is already in the room
    """
    quiz = quiz_loader.get_room_data(room_id=room_id)
    if not quiz:
        raise HTTPException(status_code=400, detail="Room not shown yet")

    return quiz


@router.get(
    "/room/{room_id}/quiz"
    # , response_model=QuizSession
)
async def get_room_quiz(
    session: SessionDep, room_id: int, student_id: Annotated[Union[int, None], Header()]
):
    """
    Return QuizzesSession  - Quiz contain list of quiz in different
    Params:
        session: SQL session
        student_in: Student information => To ensure student is already in the room
    """
    if not student_id:
        raise HTTPException(status_code=400, detail="You have not joined the room")

    # Verify studentid
    if not verify_student_in_room(
        session=session, room_id=room_id, student_id=student_id
    ):
        raise HTTPException(status_code=400, detail="You have not joined the room")

    room_object = get_room_by_id(session=session, room_id=room_id)
    if not room_object.is_published:
        raise HTTPException(status_code=400, detail="Room has been closed")

    quiz = quiz_loader.get_room_data(room_id=room_id)
    if not quiz:
        raise HTTPException(status_code=400, detail="Room not shown yet")

    return quiz


@router.post("/room/{room_id}/start_quiz", response_model=LoaderQuizData)
async def start_room_quiz(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    """
    Return: RoomSession - Room info with the random questions list
    Params:
        session: SQL session
        Teacher: Teacher info. To ensure teacher is room owner
    """
    # get_quiz_owner_id()
    # DB function: Verify room owner
    # Db function: Get room and quizquestionsanswers information from the DB
    #   Randomnizing question function  - return questions order list
    # DB function for getting questions in questions order list
    if not verify_room_owner(session=session, room_id=room_id, teacher_id=teacher.id):
        raise HTTPException(
            status_code=400,
            detail="You are not owner of this room or room not available",
        )

    room_object = get_room_by_id(session=session, room_id=room_id)

    quiz = get_quiz(session=session, quiz_id=room_object.quiz_id, teacher_id=teacher.id)

    quiz_data = LoaderQuizData.model_validate(
        quiz,
        update={
            "questions": [
                LoaderQuestionData.model_validate(ques) for ques in quiz.questions
            ]
        },
    )
    quiz_out = quiz_loader.store_room_data(room_id=room_id, quiz_data=quiz_data)

    if not quiz_out:
        raise HTTPException(status_code=400, detail="Room already started")

    if room_object.is_randomized:
        quiz_out = quiz_loader.randomnizng_question_list(room_id=room_id)

    return quiz_out


@router.post("/room/{room_id}/next_question")
async def start_next_ques(session: SessionDep, teacher: CurrentUserDep, room_id: int):
    """
    Teacher move to next question
    """

    if not verify_room_owner(session=session, room_id=room_id, teacher_id=teacher.id):
        raise HTTPException(
            status_code=400,
            detail="You are not owner of this room or room not available",
        )

    room_object = get_room_by_id(session=session, room_id=room_id)

    # check loader quiz
    next_ques = quiz_loader.move_to_next_question(room_id=room_object.id)

    if not next_ques:
        raise HTTPException(
            status_code=400, detail="No more avail question or session not available"
        )

    return next_ques


@router.post("/room/{room_id}/end_session"
            #  , response_model=None
             )
def end_room(session: SessionDep, teacher: CurrentUserDep, room_id: int, end_room_data:EndRoomBody):
    """
    Not Implemented yet
    End the current room session and return statistics of all user
    """
    
    create_end_room_body(session=session, data=end_room_data, room_id=room_id)
    pass


@router.post("/room/{room_id}/answer", response_model=QuestionReponsePublic)
async def submit_question_response(
    session: SessionDep,
    room_id: int,
    question_response: QuestionResponseCreate,
    student_id: Annotated[Union[int, None], Header()],
):
    """
    Create QuestionResponse for student

    Return: QuestionResponsePublic models
    """
    if not student_id:
        raise HTTPException(status_code=400, detail="You have not joined the room")

    if not verify_student_in_room(
        session=session, room_id=room_id, student_id=student_id
    ):
        raise HTTPException(status_code=400, detail="You have not joined the room")

    room_object = get_room_by_id(session=session, room_id=room_id)
    if not room_object.is_published:
        raise HTTPException(status_code=400, detail="Room has been closed")

    ques = quiz_loader.get_question_from_room_quiz(
        room_id=room_id, question_id=question_response.question_id
    )
    if not ques:
        raise HTTPException(status_code=400, detail="Question not avail")

    time_taken = (datetime.now() - ques.time_start).total_seconds() * 1000

    response_out = create_question_response(
        session=session,
        question_response_in=question_response,
        total_time=int(time_taken),
    )

    return response_out


@router.post("/room/{room_id}/join", response_model=StudentPublic)
def student_join_room(session: SessionDep, room_id: int, student_in: StudentRegister):
    """
    Student join room
    """

    # Add room verify
    room_out = get_room_by_id(session=session, room_id=room_id)

    if not room_out:
        raise HTTPException(status_code=400, detail="Room is not available")

    if not room_out.is_published:
        raise HTTPException(status_code=400, detail="Room is not published")

    student = create_student(session=session, student_in=student_in)
    return student


@router.get("/room/{room_id}/students", response_model=StudentList)
def get_room_students(session: SessionDep, room_id: int):
    """
    Get all students for room if room is open
    """
    room_out = get_room_by_id(session=session, room_id=room_id)

    if not room_out:
        raise HTTPException(status_code=400, detail="Room is not available")

    if not room_out.is_published:
        raise HTTPException(status_code=400, detail="Room is not open")

    student_list = get_student_in_room(session=session, room_id=room_id)

    return student_list


@router.get("/room/{room_id}/stats")
def get_room_stats(session: SessionDep, student: StudentPublic, room_id: int):
    """
    Not Implemented yet
    Get statistics for the whole group
    """
    pass
