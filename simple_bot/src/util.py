from googleapiclient.discovery import build
from dotenv import load_dotenv
import requests, os


load_dotenv()


USERNAME = os.getenv("BOT_USERNAME")
PASSWORD = os.getenv("BOT_PASSWORD")
BACKEND_URL = os.getenv("BACKEND_URL")
API_KEY = os.getenv("API_KEY")
INSTAGRAM_PASSWORD = os.getenv("INSTAGRAM_PASSWORD")

ENGLISH_CHANNEL_ID = "UC8KFs307LrTkQCu-P1Fl6dw"


def get_videos_from_channel():
    youtube = build('youtube', 'v3', developerKey=API_KEY)
    
    request = youtube.channels().list(
        part='contentDetails',
        id=ENGLISH_CHANNEL_ID
    )
    response = request.execute()
    uploads_playlist_id = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    
    videos = []
    next_page_token = None

    while True:
        playlist_request = youtube.playlistItems().list(
            part='snippet',
            playlistId=uploads_playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )
        playlist_response = playlist_request.execute()

        for item in playlist_response['items']:
            title = item['snippet']['title']
            video_id = item['snippet']['resourceId']['videoId']
            thumbnail = item['snippet']['thumbnails']['high']['url']  
            url = f"https://www.youtube.com/watch?v={video_id}"
            livestream = "live" in title.lower().split()
            upload_date = item["snippet"]["publishedAt"]
            videos.append({
                "title": title,
                "video_id": video_id,
                "thumbnail": thumbnail,
                "url": url,
                "livestream": livestream,
                "upload_date": upload_date
            })

        next_page_token = playlist_response.get('nextPageToken')
        if not next_page_token:
            break

    return videos


def login_and_get_token():
    login_url = f"{BACKEND_URL}/token"
    payload = {
        "username": USERNAME,
        "password": PASSWORD
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(login_url, data=payload, headers=headers)
        if response.status_code == 200:
            token_data = response.json()
            return token_data["access_token"]
        else:
            return None
    except Exception:
        return None
