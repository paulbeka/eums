import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
DESTINATION_EMAIL = os.getenv("DESTINATION_EMAIL")
CAPTCHA_KEY = os.getenv("CAPTCHA_KEY")
HOST_URL = os.getenv("HOST_URL")
ADMIN_EMAIL_LIST = os.getenv("ADMIN_EMAIL_LIST", "").strip()
EUMS_BEEHIIV_KEY = os.getenv("EUMS_BEEHIIV_KEY")
PUBLICATION_ID = os.getenv("PUBLICATION_ID")


if ADMIN_EMAIL_LIST:
    ADMIN_EMAIL_LIST = ADMIN_EMAIL_LIST.split(",")
else:
    ADMIN_EMAIL_LIST = []

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

SMTP_SETTINGS = {
    "host": "smtp.gmail.com",
    "port": 465,
    "username": EMAIL_USERNAME,
    "password": EMAIL_PASSWORD,
    "destination_email": DESTINATION_EMAIL
}
