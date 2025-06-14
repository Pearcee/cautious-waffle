from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker


DATABASE_URL = "sqlite:///./usersv1.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()