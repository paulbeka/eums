
## TODO: adapt this to post only text content to the updated article displayer (how do we do bold, underlined..?)

def publish_ai_content():
	access_token = login_and_get_token()
	api_endpoint = f"{BACKEND_URL}/article"

	generated_articles = os.listdir(GENERATED_ARTICLES_FOLDER)
	for ai_file in generated_articles:

		f = open(ai_file, "r")
		data = json.load(f)
		f.close()

		payload = {
			"title": data["title"],
			"content": string_to_draftjs(data["content"]),
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


def string_to_draftjs(content):
	contentParagraphs = content.split("\n")
	
	draftjs_content = {
		"blocks": [],
		"entityMap": {}
	}

	for i, paragraph in enumerate(contentParagraphs):
		if len(paragraph) <= 0:
			continue
		draftjs_content["blocks"].append({
			"key":	str(i),
			"text": paragraph,
			"type": "unstyled",
			"depth": 0,
			"inlineStyleRanges": [],
			"entityRanges": []
		})

	if len(draftjs_content["blocks"]) <= 0:
		raise RuntimeError("No content!")#

	return draftjs_content
