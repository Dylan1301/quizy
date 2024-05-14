from core.db.question import create_question_response
from core.db.db import create_student
from models.user import StudentRegister
from models.question import QuestionResponseCreate
from models.question import QuestionResponseCreate
from models.endroom import EndRoomBody, StudentEndModel, QuestionEndModel, AnswerEndModel
from sqlmodel import Session
from typing import List, Dict, Optional


def create_student_end_model(session: Session, data: StudentEndModel) -> None:
    student_in = StudentRegister.model_validate(data)
    create_student(session=session, student_in=student_in)


def create_question_response_model(session: Session, question_id: int, answer_id: int, room_id: int, data: AnswerEndModel):
    for studentid in data.studentIds:
        question_response_in = QuestionResponseCreate(student_id=studentid, room_id=room_id, question_id=question_id, answer_id=answer_id)
        create_question_response(
            session=session, question_response_in=question_response_in, total_time=1)


def create_end_room_body(session: Session, data: EndRoomBody, room_id: int):
    # for student_id, student in data.students.items():
    #     create_student_end_model(session=session, data= student)
    
    for question_id, question in data.questions.items():
        for answer_id, answer in question.answers.items():

            create_question_response_model(session=session, 
                                           question_id=int(question_id), 
                                           answer_id=int(answer_id), 
                                           room_id=room_id, 
                                           data=answer)
    
