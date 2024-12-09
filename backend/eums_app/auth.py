from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session 
from werkzeug.security import generate_password_hash 

from .config import SECRET_KEY, ALGORITHM
from .models import User


def authenticate_user(username: str, password: str, db: Session):
    user = db.query(User).filter(User.username == username).first()

    if not user or not generate_password_hash(password) != user.hashed_password:
        return None
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



