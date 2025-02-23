from fastapi import FastAPI, Depends, HTTPException, status, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session
from typing import Optional, Dict, Callable, Any, List
from email.message import EmailMessage
from .auth import authenticate_user, create_access_token
from .schemas import Token, ArticleResponse, ContactForm
from .config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM, SMTP_SETTINGS, CAPTCHA_KEY
from .models import Base, User, Article
from .db import engine, get_db
from .crud import *
from .email.email_util import send_article_uploaded_to_admins

from datetime import timedelta
from jose import JWTError, jwt
import aiosmtplib, requests, os


app = FastAPI()
os.makedirs("thumbnails", exist_ok=True)

app.mount("/thumbnails", StaticFiles(directory="thumbnails"), name="thumbnails")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:80",
        "http://localhost",
        "http://0.0.0.0:3000",
        "http://0.0.0.0:80",
        "http://0.0.0.0",
        "http://134.122.92.255",
        "http://134.122.92.255:80", 
        "http://134.122.92.255:3000",
        "http://eumadesimple.eu:3000",
        "http://eumadesimple.eu:80",
        "http://eumadesimple.eu",
        "https://eumadesimple.eu:3000",
        "https://eumadesimple.eu:80",
        "https://eumadesimple.eu"
        ],
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
async def create_article_endpoint(article: ArticleResponse, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    article = run_if_authenticated(token, create_article, db, 
        article.title, article.content, False, article.thumbnail, article.selectedTags)
    ### TODO: SEND EMAIL TO ADMINS WITH THE CREATED ARTICLE
    await send_article_uploaded_to_admins(article)
    return article


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


#### TAGS ####

@app.get("/tags")
def get_all_tags(db: Session = Depends(get_db)):
    return get_tags(db)


@app.post("/tags")
def post_new_tag(tagName: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_authenticated(token, create_tag, db, tagName)


#### YOUTUBE / INTERVIEW VIDEOS ####


@app.post("/videos/")
def post_video_endpoint(payload: Dict[str, str], db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_authenticated(token, create_video, db, 
        payload["title"], payload["thumbnail"], payload["url"], payload["livestream"] == "true", payload["upload_date"])


@app.delete("/videos/{videoId}")
def delete_video_endpoint(videoId: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_authenticated(token, delete_video, db, videoId)


@app.get("/videos/")
def get_videos_endpoint(livestreams: bool, db: Session = Depends(get_db)):
    return get_videos(livestreams, db)


#### EMAIL ####

@app.post("/contact")
async def send_email(contact: ContactForm):

    url = f"https://www.google.com/recaptcha/api/siteverify?secret={CAPTCHA_KEY}&response={contact.captcha}"

    response = requests.post(url)
    result = response.json()

    if not result.get("success"):
        raise HTTPException(status_code=400, detail="Captcha verification failed")

    try:
        # Create the email message
        email_message = EmailMessage()
        email_message["From"] = SMTP_SETTINGS["username"]
        email_message["To"] = SMTP_SETTINGS["destination_email"]
        email_message["Subject"] = contact.subject
        email_message.set_content(
            f"Name: {contact.name}\n"
            f"Email: {contact.email}\n\n"
            f"Message:\n{contact.message}"
        )

        # Send the email using aiosmtplib
        await aiosmtplib.send(
            email_message,
            hostname=SMTP_SETTINGS["host"],
            port=SMTP_SETTINGS["port"],
            username=SMTP_SETTINGS["username"],
            password=SMTP_SETTINGS["password"],
            use_tls=False,
            start_tls=True,  # Use STARTTLS for secure connection
        )

        return {"message": "Email sent successfully"}
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email.")
