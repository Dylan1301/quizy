from requests import session
from sqlmodel import create_engine, Session, select
from api.deps import SessionDep
from models.question import QuestionAnswer, QuestionsPublic
from models.quiz import Quiz, QuizCreate, QuizQuestions, QuizzesPublic
from models.question import Question, QuestionAnswer
from core.security import get_password_hash, verify_password
from typing import Union, List


def get_quizzes(*, session: Session, teacher_id: Union[int, None], skip: int = 0, limit: int = 100) -> Union[QuizzesPublic, None]:
    statement = (select(Quiz)
                 .where(Quiz.teacher_id == teacher_id)
                 .offset(skip)
                 .limit(limit))
    items = session.exec(statement).all()

    return QuizzesPublic.model_validate(items)

def create_quiz(*, session: Session, quiz_in: QuizCreate, teacher_id: Union[int, None])->Quiz:
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
        "questions": map(lambda x: get_question_answer(session=session, question_in=x),item.questions) # List of questions - inside each question -> list of answer.
    })
    return result


def get_question_answer(*, session: Session, question_in: Question)-> QuestionAnswer:
    statement = (select(Question)
                 .where(Question.id == question_in.id))
    item = session.exec(statement).one()
    result = QuestionAnswer.model_validate(item, update={
        "answers": item.answers 
    })
    return result