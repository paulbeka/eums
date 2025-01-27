from ..util import login_and_get_token, get_videos_from_channel
from dotenv import load_dotenv
import os, requests, json


load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")


def get_videos_and_thumbnails():
    access_token = login_and_get_token()
    if not access_token:
        return

    videos = get_videos_from_channel()

    api_endpoint = f"{BACKEND_URL}/videos"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    all_content = set()

    # todo: get from the backend to check what videos already exist first.
    response = requests.get(f"{api_endpoint}?livestreams=false", headers=headers)
    if response.status_code != 200:
        raise Exception("The get request to fetch existing videos failed!")
    all_content.update(set([item["title"] for item in json.loads(response.text)]))

    response = requests.get(f"{api_endpoint}?livestreams=true", headers=headers)
    if response.status_code != 200:
        raise Exception("The get request to fetch existing videos failed!")
    all_content.update(set([item["title"] for item in json.loads(response.text)]))

    for video in videos:
        print(video["title"], video["upload_date"], video["livestream"])
        if video["title"] in all_content:
            break
        payload = {
            "title": video["title"],
            "thumbnail": video["thumbnail"],
            "url": video["url"],
            "livestream": str(video["livestream"]).lower(),
            "upload_date": video["upload_date"]
        }

        try:
            response = requests.post(api_endpoint, json=payload, headers=headers)
            if response.status_code != 200:
                print(f"Failed to upload video '{video['title']}': {response.text}")
        except Exception as e:
            print(f"An error occurred while posting video '{video['title']}': {e}")