from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Date, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


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
    public = Column(Boolean, nullable=False)
    thumbnail = Column(String)
    tags = relationship('TopicTag', secondary=article_tags, back_populates='articles')


class TopicTag(Base):
    __tablename__ = "topic_tags"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag = Column(String, nullable=False)

    articles = relationship('Article', secondary=article_tags, back_populates='tags')
