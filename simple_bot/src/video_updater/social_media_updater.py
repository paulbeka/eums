from instaloader import Instaloader, Profile
import time

def social_media_publish():
    login_user = "UESFrenchMadeSimple"
    login_pass = "YpW3j;umRcZ-Vj3"
    target_profile = "eu_made_simple"

    L = Instaloader()
    L.load_session_from_file("UESFrenchMadeSimple")

    try:
        time.sleep(20)
        profile = Profile.from_username(L.context, target_profile)
        posts = profile.get_posts()

        # Only fetch and download the latest post
        for post in posts:
            time.sleep(5)
            L.download_post(post, target=profile.username)
            print(f"Downloaded post: {post.shortcode}")
            break

    except Exception as e:
        print(f"Error fetching posts: {e}")

if __name__ == "__main__":
    social_media_publish()
