import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

ACCESS_TOKEN_EXPIRE_MINUTES = 30

SMTP_SETTINGS = {
    "host": "smtp.gmail.com",
    "port": 587,
    "username": EMAIL_USERNAME,
    "password": EMAIL_PASSWORD
}