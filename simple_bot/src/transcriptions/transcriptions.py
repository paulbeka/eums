from ..util import get_videos_from_channel
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
import json, os


load_dotenv()

API_KEY = os.getenv("API_KEY")


def fetch_transcription(video_title, video_id):
	try:
		transcript = YouTubeTranscriptApi.get_transcript(video_id)
		transcript_text = " ".join([entry['text'] for entry in transcript])

		with open(filename, "w", encoding="utf-8") as file:
			json.dump(transcription_data, file, ensure_ascii=False, indent=4)

		print(f"Saved transcript for: {video_title}")
		return True

	except Exception as e:
		print(e)
		print(f"Transcript not available for {video_title}")
		return False


def get_transcriptions_pipeline():
	videos = get_videos_from_channel("UC8KFs307LrTkQCu-P1Fl6dw")
	transcripts = []
	for video in videos[0:20]: # TODO: MAKE THIS A VARIABLE
		try:
			print(f"Fetching video transcript for: {video['title']}")
			transcript = YouTubeTranscriptApi.get_transcript(video['video_id'])
			transcripts.append({
				"title": video["title"],
				"content": " ".join([entry['text'] for entry in transcript])
			})
		except Exception as e:
			print(e)
	return transcripts


def get_transcriptions():
	transcript_count = 0
	videos = get_videos_from_channel()
	for video in videos:
		success = fetch_transcription(video["title"], video["video_id"])
		transcript_count += int(success)

	print(f"Got transcriptions for {transcript_count}/{len(videos)}")
