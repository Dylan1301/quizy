from fastapi import APIRouter, HTTPException
from api.deps import SessionDep, CurrentUserDep
from core.db.question import get_questions
from core.db.quiz import get_quiz_owner_id
from models.question import Question, QuestionsPublic

router = APIRouter()


@router.get("/quiz/{quiz_id}/questions", response_model=QuestionsPublic)
def get_questions_api(session: SessionDep, quiz_id: int, teacher: CurrentUserDep):
    if not get_quiz_owner_id(session=session, quiz_id=quiz_id, teacher_id=teacher.id):
        raise HTTPException(status_code=400, detail="Do not have permissions")

    return get_questions(session=session, question_id=Question)
