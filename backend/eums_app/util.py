import base64, os
from jose import JWTError, jwt
from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import Callable, Any

from .config import ALGORITHM, SECRET_KEY
from .models import User


def save_thumbnail(thumbnail_base64: str, filename: str):
    thumbnail_data = base64.b64decode(thumbnail_base64)
    os.makedirs("thumbnails", exist_ok=True)
    with open(f"thumbnails/{filename}", "wb") as f:
        f.write(thumbnail_data)


def get_user_from_token(token: str, db: Session):
    if token is None:
        return None
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    return db.query(User).filter(User.username == username).first()


def verify_token(token: str, db: Session, admin: bool = False):
    try:
        if token is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user: User = get_user_from_token(token, db)
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        if admin and (not user.is_admin):
            raise HTTPException(status_code=403, detail="Admin access required")

        return {"status": "valid", "admin": admin}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def run_if_admin(token: str, db: Session, method: Callable[..., Any], *args, **kwargs) -> dict:
    isAuthenticated = verify_token(token, db, admin = True)
    if isAuthenticated.get("admin"):
        return method(db, *args, **kwargs)
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")


def run_if_logged_in(token: str, db: Session, method: Callable[..., Any], *args, **kwargs) -> dict:
    user = get_user_from_token(token, db)
    if user:
        return method(db, *args, **kwargs)
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")
