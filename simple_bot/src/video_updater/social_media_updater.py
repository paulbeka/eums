import instaloader
from instaloader.exceptions import TwoFactorAuthRequiredException
from ..util import INSTAGRAM_PASSWORD

USERNAME = "eu_made_simple"
SESSION_FILE = f"{USERNAME}.session"


def social_media_publish():
    L = instaloader.Instaloader()

    try:
        print(f"Loading saved session for {USERNAME}...")
        L.load_session_from_file(USERNAME)
        print("Session loaded successfully.")
    except FileNotFoundError:
        print(f"No saved session found. Logging in as {USERNAME}...")
        PASSWORD = INSTAGRAM_PASSWORD  # Use imported password, or fallback to input
        if not PASSWORD:
            PASSWORD = input("Enter your Instagram password: ")

        try:
            L.login(USERNAME, PASSWORD)  # This may raise TwoFactorAuthRequiredException
        except TwoFactorAuthRequiredException:
            two_factor_code = input("Two-factor authentication required. Enter 2FA code: ")
            L.two_factor_login(two_factor_code)

        L.save_session_to_file(filename=SESSION_FILE)
        print("Login successful. Session saved.")

    print("Fetching latest posts...")
    profile = instaloader.Profile.from_username(L.context, USERNAME)

    count = 0
    for post in profile.get_posts():
        print(f"{post.date_utc.strftime('%Y-%m-%d')} - {post.permalink}")
        count += 1
        if count == 5:
            break


def main():
    social_media_publish()


if __name__ == "__main__":
    main()
