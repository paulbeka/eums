from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime
from typing import List
import json

from .models import User, Article, Video, TopicTag
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
    query = db.query(Article).options(joinedload(Article.tags))
    if public_only:
        query = query.filter(Article.public == True)
    articles = query.offset(skip).limit(limit).all()

    return [
        {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "public": article.public,
            "thumbnail": article.thumbnail,
            "tags": [{"id": tag.id, "tag": tag.tag} for tag in article.tags],
        }
        for article in articles
    ]

def get_article(articleId: str, db: Session, public_only: bool = True):
    query = db.query(Article).filter(Article.id == articleId)
    return query.first()



def create_article(db: Session, title: str, content: dict, public: bool, thumbnail_base64: str, tags: List[str]):
    thumbnail_filename = None
    if thumbnail_base64:
        thumbnail_filename = f"{title.replace(' ', '_')}_thumbnail.png"
        save_thumbnail(thumbnail_base64, thumbnail_filename)

    existing_tags = db.query(TopicTag).filter(TopicTag.tag.in_(tags)).all()
    existing_tag_names = {tag.tag for tag in existing_tags}

    new_tags = [tag for tag in tags if tag not in existing_tag_names]
    for tag_name in new_tags:
        new_tag = TopicTag(tag=tag_name)
        db.add(new_tag)
        existing_tags.append(new_tag) 

    db_article = Article(
        title=title,
        content=json.dumps(content),
        public=public,
        thumbnail=thumbnail_filename,
        tags=existing_tags  
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

def create_video(db: Session, title: str, thumbnail: str, url: str, livestream: str, upload_date: str):
    parsed_date = datetime.strptime(upload_date, "%Y-%m-%dT%H:%M:%SZ")
    video = Video(title=title, thumbnail=thumbnail, 
        url=url, livestream=livestream, upload_date=parsed_date)
    db.add(video)
    db.commit()
    db.refresh(video)
    return video.id


def delete_video(db: Session, videoId: str):
    video = db.query(Video).filter(Video.id == videoId).first()
    if video:
        db.delete(video)
        db.commit()
        return {"detail": "Video deleted successfully"}
    else:
        raise Exception("Video not found")


def get_videos(livestreams: bool, db: Session, skip: int = 0, limit: int = 10):
    query = db.query(Video).filter(Video.livestream == livestreams).order_by(Video.upload_date.desc())
    return query.offset(skip).limit(limit).all()


### CATEGORY TAGS ###

def create_tag(db: Session, tag: str):
    tag = TopicTag(tag=tag)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag.id


def get_tags(db: Session):
    return db.query(TopicTag).all()