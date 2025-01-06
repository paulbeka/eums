from sqlalchemy.orm import Session
from sqlalchemy import func
import json

from .models import User, Article, Video
from .util import save_thumbnail


### AUTH / LOGIN ###

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, username: str, hashed_password: str):
    db_user = User(username=username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


### ARTICLES ###


def get_articles(db: Session, skip: int = 0, limit: int = 10, public_only: bool = True):
    query = db.query(Article)
    if public_only:
        query = query.filter(Article.public == True)
    return query.offset(skip).limit(limit).all()


def get_article(articleId: str, db: Session, public_only: bool = True):
    query = db.query(Article).filter(Article.id == articleId)
    return query.first()


def create_article(db: Session, title: str, content: dict, public: bool, thumbnail_base64: str):
    thumbnail_filename = None
    if thumbnail_base64:
        thumbnail_filename = f"{title.replace(' ', '_')}_thumbnail.png"
        save_thumbnail(thumbnail_base64, thumbnail_filename)

    db_article = Article(
        title=title, 
        content=json.dumps(content), 
        public=public,
        thumbnail=thumbnail_filename
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article.id


def edit_article(db: Session, id: int, title: str, content: str, public: bool):
    db_article = db.query(Article).filter(Article.id == id).first()
    if not db_article:
        raise Exception("Article not found")
    db_article.title = title
    db_article.content = json.dumps(content)
    db_article.public = public
    db.commit()
    db.refresh(db_article)
    return db_article


def delete_article(db: Session, articleId: str):
    article = db.query(Article).filter(Article.id == articleId).first()
    if article:
        db.delete(article)
        db.commit()
        return {"detail": "Article deleted successfully"}
    else:
        raise Exception("Article not found")


def change_article_visibility(db: Session, articleId: int, public: bool):
    article = db.query(Article).filter(Article.id == articleId).first()
    if not article:
        raise Exception("Article not found")
    article.public = public
    db.commit()
    db.refresh(article)
    return article


### VIDEOS ###

def create_video(db: Session, title: str, thumbnail: str, url: str):
    video = Video(title=title, thumbnail=thumbnail, url=url)
    db.add(video)
    db.commit()
    db.refresh(video)
    return video.id


def get_videos(livestreams: Boolean, db: Session, skip: int = 0, limit: int = 10):
    query = db.query(Video).filter(Video.livestreams == livestreams)
    return query.offset(skip).limit(limit).all()
