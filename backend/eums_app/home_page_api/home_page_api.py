from fastapi import APIRouter, Depends, Query, Security

from datetime import datetime
from sqlalchemy import desc, union_all, or_
from sqlalchemy.orm import Session
from typing import List, Union, Optional

from ..util import get_user_from_token
from ..models import Article, Video, SocialMediaPost, Like
from ..db import get_db

from datetime import date, datetime as dt
from fastapi.security import OAuth2PasswordBearer

homePageRouter = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


@homePageRouter.get("/content")
def get_all_content_endpoint(
	language: str = "English",
	skip: int = 0,
	limit: int = 20,
	db: Session = Depends(get_db),
	public_only: bool = Query(True),
	token: Optional[str] = Security(oauth2_scheme)
):
	# Fetch posts/articles
	articles_query = db.query(Article).filter(Article.editing_status == "public") if public_only else db.query(Article)
	articles = articles_query.order_by(desc(Article.upload_date)).offset(skip).limit(limit).all()
	
	# Fetch videos
	videos_query = None
	if language == 'English':
		videos_query = db.query(Video).filter(
			or_(Video.language == 'English', Video.language.is_(None))
		)
	else:
		videos_query = db.query(Video).filter(Video.language == language)
	videos = videos_query.order_by(desc(Video.upload_date)).offset(skip).limit(limit).all()

	# Fetch social media posts
	social_media_query = db.query(SocialMediaPost)
	social_media_posts = social_media_query.order_by(desc(SocialMediaPost.upload_date)).offset(skip).limit(limit).all()

	user_id = None
	if token:
		user = get_user_from_token(token, db)
		if user:
			user_id = user.id
	
	# Combine them
	combined_content = []
	for article in articles:
		combined_content.append({
			"id": article.id,
			"type": "article",
			"title": article.title,
			"upload_date": article.upload_date,
			"thumbnail": article.thumbnail,
			"total_likes": db.query(Like).filter(Like.article_id == article.id).count(),
			"user_has_liked": db.query(Like).filter_by(user_id=user_id, article_id=article.id).first() is not None if user_id else None
		})
	
	for video in videos:
		combined_content.append({
			"id": video.id,
			"type": "video",
			"url": video.url,
			"title": video.title,
			"upload_date": video.upload_date,
			"thumbnail": video.thumbnail
		})

	for media_post in social_media_posts:
		combined_content.append({
			"id": media_post.id,
			"type": "social_media",
			"url": media_post.url,
			"upload_date": media_post.upload_date,
			"thumbnail": media_post.thumbnail
		})
	
	# Sort everything by created_at descending

	combined_content.sort(
		key=lambda x: dt.combine(x["upload_date"], dt.min.time()) if isinstance(x["upload_date"], date) and not isinstance(x["upload_date"], dt) else x["upload_date"],
		reverse=True
	)
	return combined_content
