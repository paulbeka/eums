from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Date, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()


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

    # Relationship to Article: One user can have many articles
    articles = relationship("Article", back_populates="author")


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

    # Foreign key to the User table
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # Relationship to User: One article belongs to one user
    author = relationship("User", back_populates="articles")

    tags = relationship('TopicTag', secondary=article_tags, back_populates='articles')


class TopicTag(Base):
    __tablename__ = "topic_tags"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag = Column(String, nullable=False)

    articles = relationship('Article', secondary=article_tags, back_populates='tags')
