from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.models import Base, Todo
from app.db.schemas import TodoSchema
from app.db.database import engine,SessionLocal, get_db

router = APIRouter(tags=["todos"],prefix="/todos")


@router.post("/")
async def add_todo(request:TodoSchema, db: Session = Depends(get_db)):
    todo = Todo(title=request.title, completed=request.completed, createdat=request.createdat)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

@router.get("/")
async def get_todos(db: Session = Depends(get_db)):
    todos = db.query(Todo).all()
    return todos

@router.get("/{name}")
async def get_todos(title,db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.title == title).first()
    return todo

@router.delete("/{id}")
async def get_todos(id,db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id== id).delete()
    if not todo:
        return {"message": "Todo not found"}
    db.commit()
    return {"message": "Todo deleted successfully"}

@router.put("/{id}")
async def update_todo(id, request: TodoSchema, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == id).first()
    if not todo:
        return {"message": "Todo not found"}
    
    todo.title = request.title
    todo.completed = request.completed
    todo.createdat = request.createdat
    db.commit()
    db.refresh(todo)
    return todo


