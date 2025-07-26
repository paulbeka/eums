from fastapi import FastAPI, Depends, HTTPException, status, Query, Header, Security, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session
from typing import Optional, Dict, Callable, Any, List
from email.message import EmailMessage
from .auth import authenticate_user, create_access_token
from .schemas import *
from .crud import *
from .config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM, SMTP_SETTINGS, CAPTCHA_KEY, EUMS_BEEHIIV_KEY, PUBLICATION_ID, REFRESH_TOKEN_EXPIRE_DAYS, AWS_EMAIL_API_KEY
from .models import Base, User, Article, ArticleStatus
from .db import engine, get_db
from .util import get_user_from_token, verify_token, run_if_admin, run_if_logged_in

from .email.email_util import send_article_uploaded_to_admins
from .home_page_api.home_page_api import homePageRouter
from .user_api.user_api import userRouter

from datetime import timedelta
from jose import JWTError, jwt
import aiosmtplib, requests, os


# TODO: Make admin and user auth DIFFERENT (via the roles stuff)


app = FastAPI()
app.include_router(homePageRouter)
app.include_router(userRouter)

os.makedirs("thumbnails", exist_ok=True)

app.mount("/thumbnails", StaticFiles(directory="thumbnails"), name="thumbnails")

# TODO: Refactor this in the future
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
        "https://eumadesimple.eu",
        "https://www.eumadesimple.eu",
        "http://backend:8000/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


#### LOGIN/AUTH ####


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@app.post("/token", response_model=dict)
async def login(
    response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    roles = []
    if user.is_admin:
        roles.append("admin")

    access_token = create_access_token(
        data={"sub": user.username, "roles": roles},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    refresh_token = create_refresh_token(data={"sub": user.username})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/verify-token")
async def verify_token_endpoint(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return verify_token(token, db)


@app.post("/refresh-token")
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token found")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        new_access_token = create_access_token(
            data={"sub": username, "roles": ["admin"]},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return {"access_token": new_access_token, "token_type": "bearer"}

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")


@app.post("/register-user")
async def register_user_endpoint(payload: RegisterUserPayload, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == payload.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    user = create_user(db, payload)
    return {"message": "User registered successfully", "user": user}

@app.put("/users/{userId}")
async def edit_user_endpoint(userId: str, payload: UpdateUserPayload, db: Session = Depends(get_db)):
    user = update_user(db, userId, payload)
    return {"message": "Profile updated successfully", "users": user}

@app.get("/users/{userId}")
async def fetch_user_endpoint(userId: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, userId)
    return user

#### ARTICLES ####

@app.post("/articles/")
async def create_article_endpoint(article: ArticleResponse, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    article = run_if_logged_in(token, db, create_article, 
        article.title, article.content, article.thumbnail, 
        article.selectedTags, get_user_from_token(token, db).id)
    # TODO: FIX THE GMAIL ACCOUNT TO SEND ARTICLES AGAIN --- BUT ACTUALLY ONLY DO THIS ON "REVIEW" PUBLISH
    # await send_article_uploaded_to_admins(article)
    return article


# TODO:: ADD CHECKS ON IF THIS IS THE SAME USER AS THE POSTER
@app.post("/articles/edit/{articleId}")
def edit_article_endpoint(articleId: str, article: ArticleResponse, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_logged_in(token, db, edit_article, articleId, 
        article.title, article.content, False)


@app.get("/articles")
def get_articles_endpoint(
            skip: int = 0, 
            limit: int = 10, 
            public_only: bool = Query(True), 
            db: Session = Depends(get_db), 
            Authorization: Optional[str] = Header(None)
        ):
    
    if not public_only:
        token = Authorization.split(" ")[1]
        run_if_admin(token, db, get_articles)

    return get_articles(db, skip, limit, public_only)


@app.get("/articles/{username}")
def get_articles_from_user_endpoint(username: str, public_only: bool = Query(True), 
            db: Session = Depends(get_db), Authorization: Optional[str] = Header(None)
        ):
    if not public_only:
        token = Authorization.split(" ")[1]
        if get_user_from_token(token, db).username == username:
            return get_articles_from_user(db, username, False)
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
    return get_articles_from_user(db, username, True)


@app.get("/article/{articleId}")
def get_article_endpoint(
    articleId: str, 
    db: Session = Depends(get_db), 
    token: Optional[str] = Security(oauth2_scheme)
):
    user_id = None
    if token:
        user = get_user_from_token(token, db)
        if user:
            user_id = user.id
    
    return get_article(articleId, db, user_id)


@app.delete("/article/{articleId}")
def delete_article_endpoint(articleId: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = get_user_from_token(token, db) 
    article = db.query(Article).filter(Article.id == articleId).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if user.is_admin or (article.user_id == user.id and article.editing_status == ArticleStatus.private):
        return delete_article(db, articleId)
    
    raise HTTPException(status_code=403, detail="Not authorized to delete this article")


@app.post("/articles/change-visibility")
def change_article_visibility_endpoint(
        payload: Dict[int, str], 
        db: Session = Depends(get_db), 
        token: str = Depends(oauth2_scheme)):
    for article_id, status in payload.items():
        if status not in ArticleStatus.__members__:
            raise HTTPException(status_code=422, detail="Invalid status")
        return run_if_admin(token, db, change_article_visibility, article_id, ArticleStatus[status])


@app.post("/articles/post-to-admins/{articleId}")
def post_article_to_admins_endpoint(articleId: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = get_user_from_token(token, db)
    article = db.query(Article).filter(Article.id == articleId).first()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if article.user_id == user.id and article.editing_status == ArticleStatus.private:
        return post_article_to_admins(article, db)
    
    raise HTTPException(status_code=403, detail="Not authorized to submit this article")


#### LIKES ####
@app.post("/like/{articleId}")
def like_post_endpoint(articleId: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    if token == None:
        raise HTTPException(status_code=401, detail="User not logged in and cannot like a post")
    return run_if_admin(token, db, toggle_like, articleId, get_user_from_token(token, db).id)


#### TAGS ####

@app.get("/tags")
def get_all_tags(db: Session = Depends(get_db)):
    return get_tags(db)


@app.post("/tags")
def post_new_tag(tagName: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_admin(token, db, create_tag, db, tagName)


#### YOUTUBE / INTERVIEW VIDEOS ####


@app.post("/videos/")
def post_video_endpoint(payload: Dict[str, str], db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_admin(token, db, create_video, 
        payload["title"], payload["thumbnail"], payload["url"], payload["livestream"] == "true", payload["upload_date"], payload["language"])


@app.delete("/videos/{videoId}")
def delete_video_endpoint(videoId: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return run_if_admin(token, db, delete_video, videoId)


@app.get("/videos")
def get_videos_endpoint(livestreams: bool, db: Session = Depends(get_db)):
    return get_videos(livestreams, db)


#### SOCIAL MEDIA POSTS ####

@app.post("/social-media/")
def post_social_media_endpoint(payload: Dict[str, str], db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    print(payload)
    return run_if_admin(token, db, create_social_media_post,
        payload["url"], payload["upload_date"], payload["thumbnail"])


@app.get("/social-media/")
def get_social_media_endpoint(db: Session = Depends(get_db)):
    return get_social_media_posts(db)


#### EMAIL ####

@app.post("/newsletter-subscribe", include_in_schema=False)
async def subscribe_to_newsletter(payload: Dict[str, str]):
    email = payload["email"]
    url = "https://api.beehiiv.com/v2/publications/{}/subscriptions".format(PUBLICATION_ID)
    
    headers = {
        "Authorization": f"Bearer {EUMS_BEEHIIV_KEY}",
        "Content-Type": "application/json"
    }

    payload = {"email": email, "reactivation_email": True}

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 201 or response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    return {"message": "Subscription successful"}


@app.post("/contact")
async def send_email(contact: ContactForm):

    url = f"https://www.google.com/recaptcha/api/siteverify?secret={CAPTCHA_KEY}&response={contact.captcha}"

    response = requests.post(url)
    result = response.json()

    if not result.get("success"):
        raise HTTPException(status_code=400, detail="Captcha verification failed")

    try:
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': AWS_EMAIL_API_KEY
        }

        payload = {
            "name": contact.name,
            "email": contact.email,
            "subject": contact.subject,
            "content": contact.message
        }

        lambda_url = "https://zo3cgn15w1.execute-api.us-east-1.amazonaws.com/prod/eums_contact"
        response = requests.post(lambda_url, headers=headers, json=payload)

        if response.status_code == 200:
            return {"message": "Email sent successfully"}

        else:
            raise HTTPException(status_code=500)

    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email.")


