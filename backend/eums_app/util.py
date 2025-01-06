import base64, os


def save_thumbnail(thumbnail_base64: str, filename: str):
    thumbnail_data = base64.b64decode(thumbnail_base64)
    os.makedirs("thumbnails", exist_ok=True)
    with open(f"thumbnails/{filename}", "wb") as f:
        f.write(thumbnail_data)