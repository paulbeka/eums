import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
USER_ID = os.getenv("INSTAGRAM_USER_ID")
TARGET_URL = os.getenv("TARGET_API_URL")

INSTAGRAM_API_URL = f"https://graph.instagram.com/{USER_ID}/media"
FIELDS = "id,caption,media_type,media_url,permalink,timestamp"

def fetch_instagram_posts():
    params = {
        "fields": FIELDS,
        "access_token": ACCESS_TOKEN
    }
    response = requests.get(INSTAGRAM_API_URL, params=params)
    if response.status_code != 200:
        print(f"Failed to fetch posts: {response.text}")
        return []
    return response.json().get("data", [])

def post_to_target(posts):
    for post in posts:
        data = {
            "url": post.get("permalink"),
            "upload_date": post.get("timestamp")
        }
        response = requests.post(TARGET_URL, json=data)
        if response.status_code == 200:
            print(f"Posted successfully: {data}")
        else:
            print(f"Failed to post: {response.status_code} - {response.text}")


def get_already_posted():
    try:
        response = requests.get(TARGET_URL)
        response.raise_for_status()
        return response.json()  # Expecting a list of dicts like {"url": ..., "upload_date": ...}
    except requests.exceptions.RequestException as e:
        print(f"Error fetching existing posts: {e}")
        return []


def main():
    already_posted = get_already_posted()
    posted_urls = {post["url"] for post in already_posted}

    posts = fetch_instagram_posts()
    new_posts = [p for p in posts if p.get("permalink") not in posted_urls]

    post_to_target(new_posts)
    

if __name__ == "__main__":
    main()