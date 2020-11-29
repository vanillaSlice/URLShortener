FROM python:3.9.0-alpine
WORKDIR /opt/app
COPY . .
RUN pip install -r requirements.txt
CMD gunicorn --bind=0.0.0.0:8000 --workers=4 --reload --preload run:app
