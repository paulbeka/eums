from ..util import login_and_get_token, get_videos_from_channel
from dotenv import load_dotenv
import os, requests, json


load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")

CHANNEL_IDS = {
    "English": "UC8KFs307LrTkQCu-P1Fl6dw",
    "French": "UCSSgqMP5-H5kl9VtuilF8KQ",
    "German": "UCiudn65dNu5K4m3GnYnJnNw",
    "Romanian": "UCH2H5GZhn5hlZDFGBrSlLYw",
    "Greek": "UCvMs8QOwT_wRBoIAtgOuNEg",
    "Italian": "UCa5-GiLrEnOn6j_Xz7_QixQ",
    "Spanish": "UCpls769Vvbb-lZV8QtV-gkA"
}


def get_videos_and_thumbnails():
    access_token = login_and_get_token()
    if not access_token:
        return

    for language in CHANNEL_IDS.keys():
        videos = get_videos_from_channel(CHANNEL_IDS[language])

        api_endpoint = f"{BACKEND_URL}/videos"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        all_content = set()

        response = requests.get(f"{api_endpoint}?livestreams=false", headers=headers)
        if response.status_code != 200:
            raise Exception("The get request to fetch existing videos failed!")
        all_content.update(set([item["url"] for item in json.loads(response.text)]))

        response = requests.get(f"{api_endpoint}?livestreams=true", headers=headers)
        if response.status_code != 200:
            raise Exception("The get request to fetch existing videos failed!")
        all_content.update(set([item["url"] for item in json.loads(response.text)]))

        for video in videos:
            print(video["title"], video["upload_date"], video["livestream"])
            if video["url"] in all_content:
                print("Already exists!")
                break
            payload = {
                "title": video["title"],
                "thumbnail": video["thumbnail"],
                "url": video["url"],
                "livestream": str(video["livestream"]).lower(),
                "upload_date": video["upload_date"],
                "language": language
            }

            try:
                response = requests.post(api_endpoint, json=payload, headers=headers)
                if response.status_code != 200:
                    print(f"Failed to upload video '{video['title']}': {response.text}")
            except Exception as e:
                print(f"An error occurred while posting video '{video['title']}': {e}")