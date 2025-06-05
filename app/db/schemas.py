from datetime import datetime
from pydantic import BaseModel

class UserSchema(BaseModel):
    name: str
    email: str
    nickname: str
    
class TodoSchema(BaseModel):
    title: str
    completed: bool = False
    createdat: datetime = datetime.now()