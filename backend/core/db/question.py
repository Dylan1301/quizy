from sqlmodel import Session, select
from typing import Union, List
from models.quiz import QuizQuestions
from models.question import QuestionAnswer, QuestionAnswerCreate, QuestionCreate, Question, QuestionPublic, QuestionResponse, QuestionResponseCreate, QuestionsPublic
from .answer import create_answer


def get_question_answer(*, session: Session, question_id: Union[int, None]) -> QuestionAnswer:
    statement = (select(Question)
                 .where(Question.id == question_id))
    item = session.exec(statement).one()
    result = QuestionAnswer.model_validate(item, update={
        "answers": item.answers
    })
    return result

def get_questions(*, session: Session, question_id: Union[int, None]) -> QuestionsPublic:
    statement = (select(Question)
                 .where(Question.id == question_id))
    items = session.exec(statement).all()
    return QuestionsPublic(data=items)
    


def create_question(*, session: Session, question_in: QuestionCreate, quiz_id: Union[int, None]):
    db_obj = Question.model_validate(question_in, update={
        "quiz_id": quiz_id
    })
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def create_question_answers(*, session: Session, quiz_id: Union[int, None], question_in: QuestionAnswerCreate) -> QuestionAnswer:
    question_create = create_question(
        session=session, question_in=QuestionCreate.model_validate(question_in), quiz_id=quiz_id)
    ans_list = [create_answer(session=session, question_id=question_create.id,
                              answer_in=ans) for ans in question_in.answers]
    ques_out = QuestionAnswer.model_validate(question_create, update={"answers": ans_list
                                                                      })
    return ques_out


def create_question_response(*, session: Session, question_response_in: QuestionResponseCreate, total_time: int) -> Union[QuestionResponse, None]:
    db_object = QuestionResponse.model_validate(question_response_in, update={
        "total_time_taken": total_time
    })
    session.add(db_object)
    session.commit()
    session.refresh(db_object)
    return db_object


# def get_questions_by_list(*, session: Session, question_orders: List[int]) -> List[QuestionAnswer]:
    

    