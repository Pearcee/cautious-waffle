from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.models import Base, User
from app.db.schemas import UserSchema
from app.db.database import engine,SessionLocal, get_db

router = APIRouter(tags=["users"],prefix="/users")


@router.post("/")
async def add_user(request:UserSchema, db: Session = Depends(get_db)):
    user = User(name=request.name, email=request.email, nickname=request.nickname)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/")
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/{name}")
async def get_users(name,db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == name).first()
    return user

@router.delete("/{name}")
async def get_users(name,db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == name).first()
    if user:
        db.delete(user)
        db.commit()
    else:
        return {"error": "User not found"}
    return {"message": "User deleted successfully"}
