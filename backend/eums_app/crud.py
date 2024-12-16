from sqlalchemy.orm import Session
from sqlalchemy import func
import json

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


def get_article(articleId: str, db: Session):
    return db.query(Article).filter(Article.id == articleId).first()


def create_article(db: Session, title: str, content: str):
    db_article = Article(title=title, content=json.dumps(content))
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


def edit_article(db: Session, id: int, title: str, content: str):
    pass


def delete_article(db: Session, articleId: str):
    article = db.query(Article).filter(Article.id == articleId).first()
    if article:
        db.delete(article)
        db.commit()
        return {"detail": "Article deleted successfully"}
    else:
        raise Exception("Article not found")

