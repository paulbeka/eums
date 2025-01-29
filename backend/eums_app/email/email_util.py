from email.message import EmailMessage

def send_article_uploaded_to_admins(article):

	email_message = EmailMessage()
	email_message["From"] = SMTP_SETTINGS["username"]
	email_message["To"] = SMTP_SETTINGS["destination_email"]
	email_message["Subject"] = contact.subject
	email_message.set_content(
		f"Name: {contact.name}\n"
		f"Email: {contact.email}\n\n"
		f"Message:\n{contact.message}"
	)

	await aiosmtplib.send(
		email_message,
		hostname=SMTP_SETTINGS["host"],
		port=SMTP_SETTINGS["port"],
		username=SMTP_SETTINGS["username"],
		password=SMTP_SETTINGS["password"],
		use_tls=False,
		start_tls=True,  # Use STARTTLS for secure connection
	)

	return {"message": "Email sent successfully"}

	
	print(f"Error occurred: {e}")
	raise HTTPException(status_code=500, detail="Failed to send email.")
