from pydantic import BaseModel, EmailStr, Field, constr, validator
from typing import Dict, Any, List, Optional
from datetime import date


EU_COUNTRIES = {
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", 
    "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", 
    "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Norway", "United Kingdom", "Non-EU"
}


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
    username: constr(min_length=3, max_length=30)
    full_name: str
    email: EmailStr 
    date_of_birth: date
    password: constr(min_length=8)
    country: Optional[str] = None
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$", description="Must be 'male', 'female' or 'other'")
    profile_picture: Optional[str] = None

    class Config:
        alias_generator = lambda string: string.lower() if string == "full_name" else string

    @validator("country")
    def check_country(cls, v):
        if v and v.upper() not in EU_COUNTRIES:
            raise ValueError("Country must be an EU member state")
        return v

