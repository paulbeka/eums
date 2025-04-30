from fastapi import APIRouter, Depends, Query

from datetime import datetime
from sqlalchemy import desc, union_all
from sqlalchemy.orm import Session
from typing import List, Union

from ..models import Article, Video, SocialMediaPost
from ..db import get_db

from datetime import date, datetime as dt

homePageRouter = APIRouter()


@homePageRouter.get("/content")
def get_all_content_endpoint(
	skip: int = 0,
	limit: int = 20,
	db: Session = Depends(get_db),
	public_only: bool = Query(True)
):
	# Fetch posts/articles
	articles_query = db.query(Article).filter(Article.editing_status == "public") if public_only else db.query(Article)
	articles = articles_query.order_by(desc(Article.upload_date)).offset(skip).limit(limit).all()
	
	# Fetch videos
	videos_query = db.query(Video)
	videos = videos_query.order_by(desc(Video.upload_date)).offset(skip).limit(limit).all()

	# Fetch social media posts
	social_media_query = db.query(SocialMediaPost)
	social_media_posts = social_media_query.order_by(desc(SocialMediaPost.upload_date)).offset(skip).limit(limit).all()
	
	# Combine them
	combined_content = []
	for article in articles:
		combined_content.append({
			"id": article.id,
			"type": "article",
			"title": article.title,
			"upload_date": article.upload_date,
			"thumbnail": article.thumbnail
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
