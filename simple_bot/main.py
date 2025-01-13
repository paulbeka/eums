from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
import os, json, argparse, requests

from ai_transcriber import transcription_to_article


load_dotenv()

API_KEY = os.getenv("API_KEY")
USERNAME = os.getenv("BOT_USERNAME")
PASSWORD = os.getenv("BOT_PASSWORD")
BACKEND_URL = os.getenv("BACKEND_URL")

ENGLISH_CHANNEL_ID = "UC8KFs307LrTkQCu-P1Fl6dw"
TRANSCRIPTS_FOLDER = "transcripts"


def get_videos_from_channel(channel_id):
    youtube = build('youtube', 'v3', developerKey=API_KEY)
    
    request = youtube.channels().list(
        part='contentDetails',
        id=channel_id
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
            livestream = '[LIVE]' in title or item['snippet'].get('liveBroadcastContent') == 'live'
            videos.append({
                "title": title,
                "video_id": video_id,
                "thumbnail": thumbnail,
                "url": url,
                "livestream": livestream
            })

        next_page_token = playlist_response.get('nextPageToken')
        if not next_page_token:
            break

    return videos


def fetch_transcription(video_title, video_id):
	try:
		transcript = YouTubeTranscriptApi.get_transcript(video_id)
		transcript_text = " ".join([entry['text'] for entry in transcript])

		transcrip
		with open(filename, "w", encoding="utf-8") as file:
			json.dump(transcription_data, file, ensure_ascii=False, indent=4)

		print(f"Saved transcript for: {video_title}")
		return True

	except Exception as e:
		print(f"Transcript not available for {video_title}")
		return False


def get_transcriptions():
	transcript_count = 0
	videos = get_videos_from_channel(ENGLISH_CHANNEL_ID)
	for video in videos:
		success = fetch_transcription(video["title"], video["video_id"])
		transcript_count += int(success)

	print(f"Got transcriptions for {transcript_count}/{len(videos)}")


def ai_generator():

	filenames = os.listdir(TRANSCRIPTS_FOLDER)

	for filename in filenames[0:3]:
		try:
			title, article = transcription_to_article(os.path.join(TRANSCRIPTS_FOLDER, filename))

			payload = {
				"title": title,
				"content": article
			}

			write_file = "_".join(title.split())
			with open(f"generated_articles/{write_file}.json", "w", encoding="utf-8") as file:
				json.dump(payload, file, ensure_ascii=False, indent=4)

			print(f"Generated {title}.")
		except Exception as e:
			print(e)
			print(f"ERROR: File {filename} failed.")


def login_and_get_token(username: str, password: str, backend_url: str):
    login_url = f"{backend_url}/token"
    payload = {
        "username": username,
        "password": password
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


def get_videos_and_thumbnails():
    access_token = login_and_get_token(USERNAME, PASSWORD, BACKEND_URL)
    if not access_token:
        return

    videos = get_videos_from_channel(ENGLISH_CHANNEL_ID)

    api_endpoint = f"{BACKEND_URL}/videos/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # todo: get from the backend to check what videos already exist first.
    response = requests.get(api_endpoint, headers=headers)
    if response.status_code != 200:
    	raise Exception("The get request to fetch existing videos failed!")

    existing_videos = response.data

    for video in videos:
        payload = {
            "title": video["title"],
            "thumbnail": video["thumbnail"],
            "url": video["url"],
            "livestream": str(video["livestream"]).lower()
        }

        try:
            response = requests.post(api_endpoint, json=payload, headers=headers)
            if response.status_code != 200:
                print(f"Failed to upload video '{video['title']}': {response.text}")
        except Exception as e:
            print(f"An error occurred while posting video '{video['title']}': {e}")


def main():
    parser = argparse.ArgumentParser(description="Process YouTube videos and generate articles.")
    
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("transcribe", help="Fetch and save transcriptions from the YouTube channel.")
    subparsers.add_parser("generate", help="Generate articles from transcriptions.")
    subparsers.add_parser("populate", help="Get videos + interviews and their thumbnails, and populate the website")

    args = parser.parse_args()

    if args.command == "transcribe":
        get_transcriptions()
    elif args.command == "generate":
        ai_generator()
    elif args.command == "populate":
    	get_videos_and_thumbnails()
    else:
        print("Please choose either 'transcribe' or 'generate'.")
        

if __name__ == '__main__':
    main()