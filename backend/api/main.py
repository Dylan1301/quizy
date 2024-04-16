from fastapi import APIRouter

from api.routes import user, login, room

api_router = APIRouter()
api_router.include_router(user.router, tags=['user'])
api_router.include_router(login.router, tags=['login'])
api_router.include_router(room.router, tags=['room'])
