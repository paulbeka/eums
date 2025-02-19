from transformers import pipeline
from dotenv import load_dotenv
import re, openai, os, json


load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

TRANSCRIPTS_FOLDER = "transcripts"
GENERATED_ARTICLES_FOLDER = "generated_articles"


def clean_transcript(text):
	text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
	text = re.sub(r'(uh|um|you know|like)', '', text, flags=re.IGNORECASE)  # Remove filler words
	return text.strip()


def generate_article_with_gpt3(text):
	response = openai.chat.completions.create(
		model="gpt-3.5-turbo",
		messages=[
			{"role": "system", "content": "You generating news articles from youtube video transcripts."},
			{"role": "user", "content": f"Convert the following transcript into a well-written news article, formatted the way Politico does. Stay true to the content and only return the article.\n\n Transcript:\n{text}"}
		],
		temperature=0.7,
		max_tokens=500
	)
	return response.choices[0].message.content


def create_news_article(transcript):
	cleaned_text = clean_transcript(transcript)
	article = generate_article_with_gpt3(cleaned_text)
	return article


def transcription_to_article(transcript_path):

	with open(transcript_path, "r", encoding='utf-8') as f:
		print(transcript_path)
		data = json.load(f)

	news_article = create_news_article(data["transcription"])

	return (data["videoTitle"], news_article)
	

def ai_generator():

	transcript_files = os.listdir(TRANSCRIPTS_FOLDER)
	generated_articles = os.listdir(GENERATED_ARTICLES_FOLDER)

	missing_transcripts = set(transcript_files) - set(generated_articles)

	for filename in list(missing_transcripts)[0:3]:
		try:
			title, article = transcription_to_article(os.path.join(TRANSCRIPTS_FOLDER, filename))

			if "live" in title.lower():
				continue

			payload = {
				"title": title,
				"content": article
			}

			with open(f"{GENERATED_ARTICLES_FOLDER}/{filename}", "w", encoding="utf-8") as file:
				json.dump(payload, file, ensure_ascii=False, indent=4)

			print(f"Generated {title}.")
		except Exception as e:
			print(f"ERROR: File {filename} failed.")
