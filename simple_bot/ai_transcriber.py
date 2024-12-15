from transformers import pipeline
from dotenv import load_dotenv
import re, openai, os, json

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def clean_transcript(text):
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = re.sub(r'(uh|um|you know|like)', '', text, flags=re.IGNORECASE)  # Remove filler words
    return text.strip()


def generate_article_with_gpt3(text):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant generating news articles from transcripts."},
            {"role": "user", "content": f"Convert the following transcript into a well-written news article. Stay true to the content and only return the article.\n\nTranscript:\n{text}"}
        ],
        temperature=0.7,
        max_tokens=500
    )
    return response['choices'][0]['message']['content'].strip()


def create_news_article(transcript):
    cleaned_text = clean_transcript(transcript)
    article = generate_article_with_gpt3(cleaned_text)
    return article


def transcription_to_article(transcript_path):

	with open(transcript_path, "r") as f:
		data = json.load(f)

	news_article = create_news_article(data["transcription"])

	return (data["title"], news_article)
	