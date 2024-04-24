from fastapi import APIRouter

from api.routes import user, login, room, quiz, question

api_router = APIRouter()
api_router.include_router(user.router, tags=['user'])
api_router.include_router(login.router, tags=['login'])
api_router.include_router(room.router, tags=['room'])
api_router.include_router(quiz.router, tags=['quiz'])
api_router.include_router(question.router, tags=['question'])