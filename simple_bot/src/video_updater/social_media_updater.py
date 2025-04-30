import tweepy
import requests
from datetime import datetime
from ..util import login_and_get_token

TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAACCa0wEAAAAA5Ox3HADZPy46V%2B1k4VSdLNHM2%2BE%3Dn26b7T6dAKWz3ZzTCHjkzeGkkVYsvhYm7LTle3rigkiG5WJX0z'
BACKEND_URL = "http://localhost:8000"

client = tweepy.Client(bearer_token=TWITTER_BEARER_TOKEN)

def get_user_id(username):
    user = client.get_user(username=username)
    return user.data.id

def post_to_backend(url, thumbnail, upload_date, token):
    payload = {
        'url': url,
        'thumbnail': thumbnail,
        'upload_date': upload_date
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(f"{BACKEND_URL}/social-media", json=payload, headers=headers)
        print(f"Posted: {payload} | Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

def get_latest_tweets(username, limit=5):
    token = login_and_get_token()
    if not token:
        return

    user_id = get_user_id(username)
    tweets = client.get_users_tweets(id=user_id, max_results=limit)

    for tweet in tweets.data:
        tweet_id = tweet.id
        tweet_url = f"https://twitter.com/{username}/status/{tweet_id}"
        thumbnail_url = "https://abs.twimg.com/icons/apple-touch-icon-192x192.png"  # Placeholder
        upload_date = datetime.utcnow().isoformat()

        print(tweet_url)
        post_to_backend(tweet_url, thumbnail_url, upload_date, token)

def social_media_updater():
    return get_latest_tweets("EU_Made_Simple")
