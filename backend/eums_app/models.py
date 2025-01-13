from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    public = Column(Boolean, nullable=False)
    thumbnail = Column(String)
    tag_id = Column(Integer, ForeignKey('topic_tags.id'))


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True, nullable=False)
    thumbnail = Column(String, nullable=False)
    url = Column(String, nullable=False)
    livestream = Column(Boolean, nullable=False)


class TopicTag(Base):
    __tablename__ = "topic_tags"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag = Column(String, nullable=False)
