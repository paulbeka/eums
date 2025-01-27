#### TODO: TURN THE JSON INTO DRAFT-JS FORMAT
def publish_ai_content():
	generated_articles = os.listdir(GENERATED_ARTICLES_FOLDER)
	api_endpoint = f"{BACKEND_URL}/article"
	access_token = login_and_get_token(USERNAME, PASSWORD, BACKEND_URL)

	payload = {

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