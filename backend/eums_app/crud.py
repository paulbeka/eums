from sqlalchemy.orm import Session
from sqlalchemy import func

from .models import User, Article


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, username: str, hashed_password: str):
    db_user = User(username=username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_articles(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Article).offset(skip).limit(limit).all()
    

def create_article(db: Session, title: str, content: str):
    db_article = Article(title=title, content=content)
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article
