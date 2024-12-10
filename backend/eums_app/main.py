from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .auth import authenticate_user, create_access_token
from .schemas import Token, ArticleResponse
from .config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from .models import Base, User, Article
from .db import engine, get_db
from .crud import get_article, get_articles, create_article

from datetime import timedelta
from jose import JWTError, jwt


Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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


#### ENDPOINTS ####

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


@app.post("/articles/")
def create_article_endpoint(article: ArticleResponse, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    print(article)
    isAuthenticated = verify_token(token)
    if isAuthenticated.status == "valid":
        return create_article(db, article.title, article.content)
    else:
        return isAuthenticated


@app.get("/articles/")
def get_articles_endpoint(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_articles(db, skip, limit)


@app.get("/articles/{articleId}")
def get_article(articleId: str, db: Session = Depends(get_db)):
    return get_article(articleId)
