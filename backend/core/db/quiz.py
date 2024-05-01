
from sqlalchemy import Boolean
from sqlmodel import create_engine, Session, select
from models.quiz import Quiz, QuizCreate, QuizQuestionsCreate, QuizQuestions, QuizzesPublic, QuizUpdate
from .question import get_question_answer, create_question, create_question_answers
from typing import Union, List


def get_quizzes(*, session: Session, teacher_id: Union[int, None], skip: int = 0, limit: int = 100) -> Union[QuizzesPublic, None]:
    statement = (select(Quiz)
                 .where(Quiz.teacher_id == teacher_id)
                 .offset(skip)
                 .limit(limit))
    items = session.exec(statement).all()

    return QuizzesPublic(data=items)


def create_quiz(*, session: Session, quiz_in: QuizCreate, teacher_id: Union[int, None]) -> Quiz:
    db_obj = Quiz.model_validate(quiz_in, update={
        "teacher_id": teacher_id
    })
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def delete_quiz(*, session: Session, quiz_id: Union[int, None], teacher_id: Union[int, None]):
    pass


def get_quiz(*, session: Session, quiz_id: Union[int, None], teacher_id: Union[int, None]) -> QuizQuestions:
    statement = (select(Quiz)
                 .where(Quiz.teacher_id == teacher_id)
                 .where(Quiz.id == quiz_id)
                 )
    item = session.exec(statement).one()
    result = QuizQuestions.model_validate(item, update={
        # List of questions - inside each question -> list of answer.
        "questions": map(lambda x: get_question_answer(session=session, question_id=x.id), item.questions)
    })
    return result


def create_quiz_questions(*, session: Session, teacher_id: Union[int, None], quiz_in: QuizQuestionsCreate) -> QuizQuestions:

    quiz_create = create_quiz(
        session=session, teacher_id=teacher_id, quiz_in=QuizCreate.model_validate(quiz_in))

    ques_list = [create_question_answers(
        session=session, quiz_id=quiz_create.id, question_in=ques) for ques in quiz_in.questions]

    quiz_out = QuizQuestions.model_validate(quiz_create, update={
        "questions": ques_list
    })
    return quiz_out

def get_quiz_owner_id(*, session:Session, quiz_id: Union[int, None], teacher_id: Union[int, None]) -> bool:
    statement = (select(Quiz.teacher_id)
                 .where(Quiz.id == quiz_id))
    result = session.exec(statement).first()
    
    if not result:
        return False
    
    return result == teacher_id



