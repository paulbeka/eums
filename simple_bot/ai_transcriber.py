from transformers import pipeline
import re
import openai


# replace 'your-api-key' with actual key
openai.api_key = 'your-api-key'


def clean_transcript(text):
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = re.sub(r'(uh|um|you know|like)', '', text, flags=re.IGNORECASE)  # Remove filler words
    return text.strip()


def generate_article_with_gpt3(text):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Convert the following transcript into a well-written news article. It should stay as true as possible to the content of the transcript as possible, include any extra info you deem necessary. Only return the artile, nothing else. Article:\n{text}\n\n",
        max_tokens=500,
        temperature=0.7
    )
    return response['choices'][0]['text'].strip()


def create_news_article(transcript):
    cleaned_text = clean_transcript(transcript)
    article = generate_article_with_gpt3(cleaned_text)
    return article


def transcription_to_article(transcript_path):

	with open(transcript_path, "r") as f:
		data = json.load(f)

	news_article = create_news_article(data["transcription"])

	return (data["title"], news_article)
	