
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


# Move to questions file

# def get_question_answer(*, session: Session, question_in: Question) -> QuestionAnswer:
#     statement = (select(Question)
#                  .where(Question.id == question_in.id))
#     item = session.exec(statement).one()
#     result = QuestionAnswer.model_validate(item, update={
#         "answers": item.answers
#     })
#     return result


def create_quiz_questions(*, session: Session, teacher_id: Union[int, None], quiz_in: QuizQuestionsCreate) -> QuizQuestions:

    quiz_create = create_quiz(
        session=session, teacher_id=teacher_id, quiz_in=QuizCreate.model_validate(quiz_in))

    ques_list = [create_question_answers(
        session=session, quiz_id=quiz_create.id, question_in=ques) for ques in quiz_in.questions]

    quiz_out = QuizQuestions.model_validate(quiz_create, update={
        "questions": ques_list
    })
    return quiz_out


# def create_question(*, session: Session, question_in: QuestionCreate, quiz_id: Union[int, None]):
#     db_obj = Question.model_validate(question_in, update={
#         "quiz_id": quiz_id
#     })
#     session.add(db_obj)
#     session.commit()
#     session.refresh(db_obj)
#     return db_obj


# def create_question_answers(*, session: Session, quiz_id: Union[int, None], question_in: QuestionAnswerCreate) -> QuestionAnswer:
#     question_create = create_question(
#         session=session, question_in=QuestionCreate.model_validate(question_in), quiz_id=quiz_id)
#     ans_list = [create_answer(session=session, question_id=question_create.id,
#                               answer_in=ans) for ans in question_in.answers]
#     ques_out = QuestionAnswer.model_validate(question_create, update={"answers": ans_list
#                                                                       })
#     return ques_out


# Move to naswers file
# def create_answer(*, session: Session, question_id: Union[int, None], answer_in: AnswerCreate):
#     db_obj = Answer.model_validate(answer_in, update={
#         "question_id": question_id
#     })
#     session.add(db_obj)
#     session.commit()
#     session.refresh(db_obj)
#     return db_obj
