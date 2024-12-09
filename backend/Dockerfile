FROM python:3.11-slim

WORKDIR /app

COPY ./backend /app

RUN pip install --no-cache-dir -r requirements.txt

RUN python populate.py 

EXPOSE 8000

CMD ["uvicorn", "eums_app.main:app", "--host", "0.0.0.0", "--port", "8000"]
