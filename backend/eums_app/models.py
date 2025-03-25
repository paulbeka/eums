from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Date, Table, UniqueConstraint, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum


Base = declarative_base()


class ArticleStatus(enum.Enum):
    public = "public"
    admin_available = "admin_available"
    private = "private"

article_status = Enum(ArticleStatus, name="articlestatus")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    hashed_password = Column(String, nullable=False)
    country = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)

    articles = relationship("Article", back_populates="author")
    likes = relationship("Like", back_populates="user")


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True, nullable=False)
    thumbnail = Column(String, nullable=False)
    url = Column(String, nullable=False)
    livestream = Column(Boolean, nullable=False)
    upload_date = Column(Date, nullable=False)


article_tags = Table(
    'article_tags',
    Base.metadata,
    Column('article_id', Integer, ForeignKey('articles.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('topic_tags.id'), primary_key=True)
)


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    editing_status = Column(article_status, nullable=False)
    thumbnail = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    author = relationship("User", back_populates="articles")

    tags = relationship('TopicTag', secondary=article_tags, back_populates='articles')
    likes = relationship("Like", back_populates="article")


class TopicTag(Base):
    __tablename__ = "topic_tags"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag = Column(String, nullable=False)

    articles = relationship('Article', secondary=article_tags, back_populates='tags')


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    article_id = Column(Integer, ForeignKey('articles.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="likes")
    article = relationship("Article", back_populates="likes")

    __table_args__ = (UniqueConstraint('user_id', 'article_id', name='unique_like'),)
