from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from eums_app.models import User 
from eums_app.db import Base, SessionLocal  
from werkzeug.security import generate_password_hash 
import os


DATABASE_URL = os.getenv("DATABASE_URL")
ADMIN_USERS = [user.strip() for user in os.getenv("ADMIN_USERS", "").split(",")]
ADMIN_PASSWORDS = [pwd.strip() for pwd in os.getenv("ADMIN_PASSWORDS", "").split(",")]

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

if len(ADMIN_USERS) != len(ADMIN_PASSWORDS):
    raise ValueError("There are not enough ADMIN_PASSWORDS for ADMIN_USERS")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

admin_users = [{"username": admin, "password": password} for admin, password in zip(ADMIN_USERS, ADMIN_PASSWORDS)]

def populate_db():
    db = SessionLocal()
    try:
        for user_data in admin_users:
            hashed_password = generate_password_hash(user_data["password"])

            existing_user = db.query(User).filter(User.email == user_data["username"]).first()

            if not existing_user:
                new_user = User(
                    full_name="Admin User",
                    username=user_data["username"],
                    email=f"{user_data['username']}@email.com",
                    hashed_password=hashed_password,
                    date_of_birth="01/01/2000",
                    is_admin=True,
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
