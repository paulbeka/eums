from email.message import EmailMessage
from ..config import SMTP_SETTINGS, ADMIN_EMAIL_LIST, HOST_URL
import aiosmtplib


async def send_article_uploaded_to_admins(articleId):

	for admin in ADMIN_EMAIL_LIST:

		email_message = EmailMessage()
		email_message["From"] = SMTP_SETTINGS["username"]
		email_message["To"] = admin
		email_message["Subject"] = "[EUMS] New article ready to be posted!"
		email_message.set_content(
			f"""
				A new article has been auto-generated from a youtube video. 
				Make sure to set a thumbnail and set it to public when ready to post. Here is the link:
				\n{HOST_URL}/article/{articleId}"""
		)

		try:
			await aiosmtplib.send(
				email_message,
				hostname=SMTP_SETTINGS["host"],
				port=SMTP_SETTINGS["port"],
				username=SMTP_SETTINGS["username"],
				password=SMTP_SETTINGS["password"],
				use_tls=False,
				start_tls=True,  # Use STARTTLS for secure connection
			)

			return {"message": f"Email sent successfully to f{admin}"}

		except Exception as e:
			print(f"Error occurred: {e}")
			print(f"Failed to send to: {admin}")

