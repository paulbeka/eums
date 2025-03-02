from ..util import login_and_get_token
from dotenv import load_dotenv
import os, requests


load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")


def publish_ai_content():
	access_token = login_and_get_token()
	api_endpoint = f"{BACKEND_URL}/article"

	generated_articles = os.listdir(GENERATED_ARTICLES_FOLDER)
	for ai_file in generated_articles:

		f = open(ai_file, "r")
		data = json.load(f)
		f.close()

		print(data["content"])

		payload = {
			"title": data["title"],
			"content": data["content"],
			"thumbnail": "",
			"selectedTags": []
		}

		headers = {
			"Authorization": f"Bearer {access_token}",
			"Content-Type": "application/json"
		}

		try:
			response = requests.post(api_endpoint, json=payload, headers=headers)
			if response.status_code != 200:
				print(f"Failed to upload video '{video['title']}': {response.text}")
		except Exception as e:
			print(f"An error occurred while posting video '{video['title']}': {e}")


def publish_ai_content_pipeline(articles):
	access_token = login_and_get_token()
	api_endpoint = f"{BACKEND_URL}/articles/"

	for article in articles:

		print(article["content"])

		payload = {
			"title": article["title"],
			"content": article["content"],
			"thumbnail": "",
			"selectedTags": []
		}

		headers = {
			"Authorization": f"Bearer {access_token}",
			"Content-Type": "application/json"
		}

		try:
			response = requests.post(api_endpoint, json=payload, headers=headers)
			if response.status_code != 200:
				print(f"Failed to upload video '{article['title']}': {response}")
		except Exception as e:
			print(f"An error occurred while posting video '{article['title']}': {e}")

