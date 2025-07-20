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
	# Fetch all relevant items from DB
	articles_query = db.query(Article).filter(Article.editing_status == "public") if public_only else db.query(Article)
	videos_query = db.query(Video)
	if language == 'English':
		videos_query = videos_query.filter(or_(Video.language == 'English', Video.language.is_(None)))
	else:
		videos_query = videos_query.filter(Video.language == language)
	social_media_query = db.query(SocialMediaPost)

	articles = articles_query.all()
	videos = videos_query.all()
	social_media_posts = social_media_query.all()

	user_id = None
	if token:
		user = get_user_from_token(token, db)
		if user:
			user_id = user.id

	# Build unified content list
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
			"type": "instagram",
			"url": media_post.url,
			"upload_date": media_post.upload_date,
			"thumbnail": media_post.thumbnail
		})

	# Sort by upload date descending
	combined_content.sort(
		key=lambda x: dt.combine(x["upload_date"], dt.min.time()) if isinstance(x["upload_date"], date) and not isinstance(x["upload_date"], dt) else x["upload_date"],
		reverse=True
	)

	# Return empty list if skip is beyond range
	if skip >= len(combined_content):
		return []

	# Apply pagination
	paginated = combined_content[skip:skip + limit]
	return paginated