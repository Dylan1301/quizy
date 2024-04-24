from sqlmodel import Session, select
from typing import Union, List
from models.answer import AnswerCreate, Answer

def create_answer(*, session: Session, question_id: Union[int, None], answer_in: AnswerCreate):
    db_obj = Answer.model_validate(answer_in, update={
        "question_id": question_id
    })
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

