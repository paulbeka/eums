from pydantic import BaseModel, EmailStr
from typing import Dict, Any, List, Optional
from datetime import date


class Token(BaseModel):
    access_token: str
    token_type: str


class ArticleResponse(BaseModel):
    title: str
    content: str
    thumbnail: str = None
    selectedTags: List[str]

    class Config:
        orm_mode = True


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    captcha: str


class RegisterUserPayload(BaseModel):
    username: str
    full_name: str
    email: str
    date_of_birth: date
    password: str
    country: Optional[str] = None
    gender: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        alias_generator = lambda string: string.lower() if string == 'full_name' else string
