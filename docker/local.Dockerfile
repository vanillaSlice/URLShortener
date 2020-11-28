FROM python:3.9.0-alpine
WORKDIR /opt/app
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
COPY ./urlshortener ./urlshortener
COPY ./config.py ./config.py
COPY ./run.py ./run.py
ENTRYPOINT gunicorn --bind=0.0.0.0:8000 --workers=4 --reload run:app
