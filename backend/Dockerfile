FROM python:3.11-slim

WORKDIR /app

COPY ./backend /app

RUN apt-get update && apt-get install -y postgresql-client

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
