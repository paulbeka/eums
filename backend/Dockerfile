# Use official Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy backend files
COPY ./backend /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the backend port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "eums_app.main:app", "--host", "0.0.0.0", "--port", "8000"]
