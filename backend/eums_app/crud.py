from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime
from typing import List
import json

from .models import User, Article, Video, TopicTag, Like, ArticleStatus
from .util import save_thumbnail
from .schemas import RegisterUserPayload


### AUTH / LOGIN ###

def get_user_by_id(db: Session, userId: str):
    return db.query(User).filter(User.id == userId).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, payload: RegisterUserPayload):
    db_user = User(
        username=payload.username,
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=payload.password,
        date_of_birth=payload.date_of_birth,
        country=payload.country,
        gender=payload.gender,
        profile_picture=payload.profile_picture,
        is_admin=False
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


### ARTICLES ###


def get_articles(db: Session, skip: int = 0, limit: int = 10, public_only: bool = True):
    query = db.query(Article).options(joinedload(Article.tags))
    if public_only:
        query = query.filter(Article.editing_status == ArticleStatus.public)
    articles = query.offset(skip).limit(limit).all()

    return [
        {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "public": article.editing_status,
            "thumbnail": article.thumbnail,
            "tags": [{"id": tag.id, "tag": tag.tag} for tag in article.tags],
        }
        for article in articles
    ]


def get_article(articleId: str, db: Session, user_id: int = None, public_only: bool = True):
    query = db.query(Article).options(
        joinedload(Article.tags), 
        joinedload(Article.author)
    ).filter(Article.id == articleId)

    article = query.first()

    if not article.editing_status == ArticleStatus.public and user_id is not None:
        user = db.query(User).filter(User.id == user_id).first()
        if user is None or (not user.is_admin):
            return None

    if article is None:
        return None

    total_likes = db.query(Like).filter(Like.article_id == article.id).count()

    user_has_liked = False
    if user_id is not None:
        user_has_liked = db.query(Like).filter_by(user_id=user_id, article_id=article.id).first() is not None

    return {
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "public": article.editing_status,
        "thumbnail": article.thumbnail,
        "tags": [{"id": tag.id, "tag": tag.tag} for tag in article.tags],
        "author": {
            "id": article.author.id,
            "username": article.author.username,
            "full_name": article.author.full_name
        },
        "posting_date": article.upload_date,
        "total_likes": total_likes,
        **({"user_has_liked": user_has_liked} if user_id is not None else {})
    }


def create_article(
    db: Session, 
    title: str, 
    content: dict, 
    thumbnail_base64: str, 
    tags: List[str], 
    user_id: int
):
    thumbnail_filename = None
    if thumbnail_base64:
        thumbnail_filename = f"{title.replace(' ', '_')}_thumbnail.png"
        save_thumbnail(thumbnail_base64, thumbnail_filename)

    existing_tags = db.query(TopicTag).filter(TopicTag.tag.in_(tags)).all()
    existing_tag_names = {tag.tag for tag in existing_tags}

    new_tags = [TopicTag(tag=tag_name) for tag_name in tags if tag_name not in existing_tag_names]
    db.add_all(new_tags)
    db.commit()  

    all_tags = existing_tags + new_tags

    editing_status = ArticleStatus.private
    if get_user_by_id(db, user_id):
        editing_status = ArticleStatus.admin_available

    db_article = Article(
        title=title,
        content=json.dumps(content),
        editing_status=editing_status,
        thumbnail=thumbnail_filename,
        user_id=user_id,
        tags=all_tags  
    )

    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article.id


### TODO: FIX THIS FOR THE DIFFERENT EDITING STATES
def edit_article(db: Session, id: int, title: str, content: str, public: bool):
    # TODO: Add edit tags functionality
    db_article = db.query(Article).filter(Article.id == id).first()
    if not db_article:
        raise Exception("Article not found")
    db_article.title = title
    db_article.content = json.dumps(content)
    db_article.editing_status = public
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


def change_article_visibility(db: Session, articleId: int, editing_status: ArticleStatus):
    article = db.query(Article).filter(Article.id == articleId).first()
    if not article:
        raise Exception("Article not found")
    article.editing_status = editing_status
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


#### Likes ####

def toggle_like(db: Session, article_id: int, user_id: int):
    like = db.query(Like).filter_by(user_id=user_id, article_id=article_id).first()
    
    if like:
        db.delete(like)
        db.commit()
        return { "like": False }
    else:
        new_like = Like(user_id=user_id, article_id=article_id)
        db.add(new_like)
        db.commit()
        db.refresh(new_like)
        return { "like": True }



#### USER MANAGEMENT AND PROFILE ####

def get_user_profile_data(username: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None

    posts_count = db.query(Article).filter(Article.author.has(id=user.id)).filter(Article.editing_status == ArticleStatus.public).count()
    likes_count = db.query(Like).join(Article).filter(Article.author.has(id=user.id)).count()

    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "date_of_birth": user.date_of_birth,
        "country": user.country,
        "gender": user.gender,
        "profile_picture": user.profile_picture,
        "is_admin": user.is_admin,
        "posts": posts_count,
        "likes": likes_count,
    }
