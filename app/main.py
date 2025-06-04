from fastapi import FastAPI, Depends, HTTPException
from app.routers import users
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)