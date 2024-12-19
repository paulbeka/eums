from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from eums_app.models import User 
from eums_app.db import Base, SessionLocal  
from werkzeug.security import generate_password_hash 


DATABASE_URL = "sqlite:///./eums.db" # get from env

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

admin_users = [
    {"username": "paul", "password": "admin"},
    {"username": "pablo", "password": "admin"},
    {"username": "lambertus", "password": "admin"}
]

def populate_db():
    db = SessionLocal()
    try:
        for user_data in admin_users:
            hashed_password = generate_password_hash(user_data["password"])

            existing_user = db.query(User).filter(User.username == user_data["username"]).first()

            if not existing_user:
                new_user = User(
                    username=user_data["username"],
                    hashed_password=hashed_password,
                )
                db.add(new_user)

        db.commit()
        print("Admin users added successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        
    finally:
        db.close()

if __name__ == "__main__":
    populate_db()
