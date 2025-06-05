from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.models import Base, Todo
from app.db.schemas import TodoSchema
from app.db.database import engine,SessionLocal, get_db

router = APIRouter(tags=["todos"],prefix="/todos")


@router.post("/")
async def add_user(request:TodoSchema, db: Session = Depends(get_db)):
    todo = Todo(title=request.title, completed=request.completed, createdat=request.createdat)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

@router.get("/")
async def get_users(db: Session = Depends(get_db)):
    todos = db.query(Todo).all()
    return todos

@router.get("/{name}")
async def get_users(title,db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.title == title).first()
    return todo

@router.delete("/{id}")
async def get_users(id,db: Session = Depends(get_db)):
    db.query(Todo).filter(Todo.id== id).delete()
    # todo = db.query(Todo).filter(Todo.title == title).first()
    # if todo:
    #     db.delete(todo)
    db.commit()
    # else:
    #     return {"error": "Todo not found"}
    return {"message": "Todo deleted successfully"}
