from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
import os, json, argparse

from ai_transcriber import transcription_to_article


load_dotenv()
API_KEY = os.getenv("API_KEY")
GPT_KEY = os.getenv("GPT_KEY")

ENGLISH_CHANNEL_ID = "UC8KFs307LrTkQCu-P1Fl6dw"


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
            videos.append((title, video_id))

        next_page_token = playlist_response.get('nextPageToken')
        if not next_page_token:
            break

    return videos


def fetch_transcription(video_title, video_id):
	try:
		transcript = YouTubeTranscriptApi.get_transcript(video_id)
		transcript_text = " ".join([entry['text'] for entry in transcript])

		transcription_data = {
			"videoTitle": video_title,
			"videoId": video_id,
			"transcription": transcript_text
		}

		safe_title = "_".join(video_title.split())
		filename = f"transcripts/{safe_title}.json"

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
	for title, video_id in videos:
		success = fetch_transcription(title, video_id)
		transcript_count += int(success)

	print(f"Got transcriptions for {transcript_count}/{len(videos)}")


def ai_generator():

	filenames = os.listdir("transcripts")
	filenames = [f for f in filenames if os.path.isfile(os.path.join(directory_path, f))]

	for filename in filenames:
		try:
			title, article = transcription_to_article(filename)

			payload = {
				"title": title,
				"content": article
			}

			write_file = "_".join(title.split())
			with open(f"generated_articles/{write_file}.json", "w", encoding="utf-8") as file:
				json.dump(payload, file, ensure_ascii=False, indent=4)

			print(f"Generated {title}.")
		except:
			print(f"ERROR: File {filename} failed.")


def main():
    parser = argparse.ArgumentParser(description="Process YouTube videos and generate articles.")
    
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("transcribe", help="Fetch and save transcriptions from the YouTube channel.")
    subparsers.add_parser("generate", help="Generate articles from transcriptions.")

    args = parser.parse_args()

    if args.command == "transcribe":
        get_transcriptions()
    elif args.command == "generate":
        ai_generator()
    else:
        print("Please choose either 'transcribe' or 'generate'.")
        

if __name__ == '__main__':
    main()