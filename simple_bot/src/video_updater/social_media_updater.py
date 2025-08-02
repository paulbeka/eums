from playwright.sync_api import sync_playwright
import time

TARGET_USERNAME = "eu_made_simple"
MAX_POSTS = 5
INSTAGRAM_LOGIN_URL = "https://www.instagram.com/accounts/login/"

def accept_cookies_if_present(page):
    try:
        buttons = [
            "button:has-text('Accept All')",
            "button:has-text('Allow all cookies')",
            "button:has-text('Only allow essential cookies')",
            "text=Accept All",
            "text=Only allow essential cookies"
        ]
        for selector in buttons:
            btn = page.locator(selector)
            if btn.is_visible(timeout=3000):
                btn.click()
                print(f"Clicked cookie accept button: {selector}")
                time.sleep(2)
                break
    except Exception as e:
        print(f"No cookie banner found or error: {e}")

def login(page, username, password):
    print("Logging in...")
    page.goto(INSTAGRAM_LOGIN_URL)
    page.wait_for_selector("input[name='username']", timeout=15000)
    accept_cookies_if_present(page)
    page.fill("input[name='username']", username)
    page.fill("input[name='password']", password)
    page.click("button[type='submit']")

    # Wait for navigation to main feed or home page
    time.sleep(3)
    return True

def fetch_latest_instagram_posts(page):
    post_links = set()
    url = f"https://www.instagram.com/{TARGET_USERNAME}/"

    print(f"Opening Instagram profile: {url}")
    page.goto(url, timeout=60000)
    time.sleep(3)  # Let page settle
    accept_cookies_if_present(page)

    page.wait_for_selector("article", timeout=15000)

    scroll_attempts = 0
    while len(post_links) < MAX_POSTS and scroll_attempts < 10:
        print(f"Scrolling attempt {scroll_attempts + 1}")
        anchors = page.locator("article a").all()
        for a in anchors:
            href = a.get_attribute("href")
            if href and href.startswith("/p/"):
                full_url = f"https://www.instagram.com{href}"
                post_links.add(full_url)
                if len(post_links) >= MAX_POSTS:
                    break

        page.mouse.wheel(0, 3000)
        time.sleep(2.5)
        scroll_attempts += 1

    return list(post_links)

def social_media_publish():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        page = context.new_page()

        username = "UESFrenchMadeSimple"
        password = "YpW3j;umRcZ-Vj3"

        if not login(page, username, password):
            print("Failed to log in. Exiting.")
            browser.close()
            return

        print(f"Fetching latest posts from @{TARGET_USERNAME}...")
        links = fetch_latest_instagram_posts(page)
        if links:
            for i, link in enumerate(links):
                print(f"{i+1}. {link}")
        else:
            print("No posts found. Instagram layout might have changed or scraping was blocked.")

        time.sleep(5)
        browser.close()

def main():
    social_media_publish()

if __name__ == "__main__":
    main()
