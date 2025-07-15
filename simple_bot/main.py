from dotenv import load_dotenv
import os, argparse

from src.ai.ai_transcriber import ai_generator, ai_generate_list
from src.transcriptions.transcriptions import get_transcriptions, get_transcriptions_pipeline
from src.publisher.publisher import publish_ai_content, publish_ai_content_pipeline
from src.video_updater.video_updater import get_videos_and_thumbnails
from src.video_updater.social_media_updater import social_media_publish


def main():
    parser = argparse.ArgumentParser(description="Process YouTube videos and generate articles.")
    
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("transcribe", help="Fetch and save transcriptions from the YouTube channel.")
    subparsers.add_parser("generate", help="Generate articles from transcriptions.")
    subparsers.add_parser("populate", help="Get videos + interviews and their thumbnails, and populate the website")
    subparsers.add_parser("publish_missing_videos", help="Fetch all latest videos, feed them to AI, and publish them")
    subparsers.add_parser("publish", help="Publish the generated AI articles (and send an email to owners)")
    subparsers.add_parser("social_media_publish", help="Publish the social media posts to the site")

    ### TODO (in the future): Populate some kind of newsletter to email to subscribers

    args = parser.parse_args()

    if args.command == "transcribe":
        get_transcriptions()
    elif args.command == "generate":
        ai_generator()
    elif args.command == "publish":
        publish_ai_content()
    elif args.command == "social_media_publish":
        social_media_publish()
    elif args.command == "publish_missing_videos":
        transcripts = get_transcriptions_pipeline()
        articles = ai_generate_list(transcripts)
        publish_ai_content_pipeline(articles)
    elif args.command == "populate":
        get_videos_and_thumbnails()
    else:
        print("Please choose either 'transcribe' or 'generate'.")
        

if __name__ == '__main__':
    main()