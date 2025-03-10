import requests


BACKEND_URL = "https://your-backend-url.com"
ARTICLES_ENDPOINT = f"{BACKEND_URL}/api/articles/"


def fetch_articles():
	try:
		response = requests.get(ARTICLES_ENDPOINT)
		response.raise_for_status()
		articles = response.json()
		return articles
	except requests.exceptions.RequestException as e:
		print(f"Error fetching articles: {e}")
		return None


def create_newsletter_from_articles(articles):
	# TODO: some kind of GPT integration for differenrt parts
	pass


if __name__ == "__main__":


# TODO: Fetch the latest articles (which ones?) maybe use date as cutoff
# then, extract the text. Use some kind of GPT generator?
# finally, post it to some kind of newspaper manager or something
def newsletter_generator():
	pass

