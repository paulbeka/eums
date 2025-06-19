from fastapi import APIRouter, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..db import get_db
from ..crud import get_user_profile_data, get_user_list, get_gdpr, delete_user
from ..util import run_if_admin, run_if_logged_in, get_user_from_token


userRouter = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


@userRouter.get("/profile/{username}")
def get_user_profile_data_endpoint(username: str, db: Session = Depends(get_db)):
	user = get_user_profile_data(username, db)
	if user is None:
		raise HTTPException(status_code=404, detail="Unknown user")
	return user


@userRouter.get("/users")
def get_user_list_endpoint(username: str = Query(""), skip: int = 0, limit: int = 10, db: Session =  Depends(get_db)):
	return get_user_list(db, username, skip, limit)


@userRouter.delete("/users")
def delete_user_endpoint(username: str = Query(""), db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
	if get_user_from_token(token) == username:
		run_if_logged_in(username)
	else:
		return run_if_admin(token, db, delete_user, username)

@userRouter.get("/gdpr")
def get_user_gdpr_data(username: str = Query(""), db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
	return run_if_logged_in(token, db, get_gdpr, username, db)
