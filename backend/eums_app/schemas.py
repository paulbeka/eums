from pydantic import BaseModel, EmailStr
from typing import Dict, Any, List


class Token(BaseModel):
    access_token: str
    token_type: str


class ArticleResponse(BaseModel):
    title: str
    content: Dict[str, Any]
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