from fastapi import FastAPI, Depends, HTTPException, status, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session
from typing import Optional, Dict, Callable, Any
from email.message import EmailMessage
from .auth import authenticate_user, create_access_token
from .schemas import Token, ArticleResponse, ContactForm
from .config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM, SMTP_SETTINGS
from .models import Base, User, Article
from .db import engine, get_db
from .crud import *

from datetime import timedelta
from jose import JWTError, jwt
import aiosmtplib



Base.metadata.create_all(bind=engine)

app = FastAPI()
app.mount("/thumbnails", StaticFiles(directory="thumbnails"), name="thumbnails")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://134.122.92.255:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"status": "valid"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def run_if_authenticated(token: str, method: Callable[..., Any], *args, **kwargs) -> dict:
    isAuthenticated = verify_token(token)
    if isAuthenticated.get("status") == "valid":
        return method(*args, **kwargs)
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")


#### LOGIN/AUTH ####

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/verify-token")
async def verify_token_endpoint(token: str = Depends(oauth2_scheme)):
    return verify_token(token)


#### ARTICLES ####

@app.post("/articles/")
def create_article_endpoint(article: ArticleResponse, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_authenticated(token, create_article, db, article.title, article.content, False, article.thumbnail)


@app.get("/articles/")
def get_articles_endpoint(
            skip: int = 0, 
            limit: int = 10, 
            public_only: bool = Query(True), 
            db: Session = Depends(get_db), 
            Authorization: Optional[str] = Header(None)
        ):
    
    if not public_only:
        try:
            token = Authorization.split(" ")[1]
            if not token:
                raise HTTPException(status_code=401, detail="Token required for non-public access")

            isAuthenticated = verify_token(token)
            if not isAuthenticated.get("status") == "valid":
                raise HTTPException(status_code=401, detail="Invalid token")

        except:
            raise HTTPException(status_code=401, detail="Invalid token")

    return get_articles(db, skip, limit, public_only)


@app.get("/article/{articleId}")
def get_article_endpoint(articleId: str, db: Session = Depends(get_db)):
    return get_article(articleId, db)


@app.delete("/article/{articleId}")
def delete_article_endpoint(articleId: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_authenticated(token, delete_article, db, articleId)


@app.post("/articles/change-visibility")
def change_article_visibility_endpoint(
        payload: Dict[int, bool], 
        db: Session = Depends(get_db), 
        token: str = Depends(oauth2_scheme)):
    for article in payload.keys():
        return run_if_authenticated(token, change_article_visibility, db, article, payload[article])


#### YOUTUBE / INTERVIEW VIDEOS ####

@app.post("/videos/")
def post_video_endpoint(payload: Dict[str, str], db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_authenticated(token, create_video)


@app.get("/videos/")
def get_videos_endpoint(db: Session = Depends(get_db)):
    return get_videos(db)


#### EMAIL ####

@app.post("/contact")
async def send_email(contact: ContactForm):
    try:
        email_message = EmailMessage()
        email_message["From"] = SMTP_SETTINGS["username"]
        email_message["To"] = "recipient@example.com"
        email_message["Subject"] = contact.subject
        email_message.set_content(
            f"Name: {contact.name}\n"
            f"Email: {contact.email}\n\n"
            f"Message:\n{contact.message}"
        )

        await aiosmtplib.send(
            email_message,
            hostname=SMTP_SETTINGS["host"],
            port=SMTP_SETTINGS["port"],
            username=SMTP_SETTINGS["username"],
            password=SMTP_SETTINGS["password"],
            use_tls=False,
            start_tls=True,
        )

        return {"message": "Email sent successfully"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))