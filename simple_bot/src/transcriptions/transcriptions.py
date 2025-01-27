from ..util import get_videos_from_channel
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
import json, os


load_dotenv()

API_KEY = os.getenv("API_KEY")


def fetch_transcription(video_title, video_id):
	try:
		transcript = YouTubeTranscriptApi.get_transcript(video_id, API_KEY)
		transcript_text = " ".join([entry['text'] for entry in transcript])

		transcrip
		with open(filename, "w", encoding="utf-8") as file:
			json.dump(transcription_data, file, ensure_ascii=False, indent=4)

		print(f"Saved transcript for: {video_title}")
		return True

	except Exception as e:
		print(e)
		print(f"Transcript not available for {video_title}")
		return False


def get_transcriptions():
	transcript_count = 0
	videos = get_videos_from_channel()
	for video in videos:
		success = fetch_transcription(video["title"], video["video_id"])
		transcript_count += int(success)

	print(f"Got transcriptions for {transcript_count}/{len(videos)}")