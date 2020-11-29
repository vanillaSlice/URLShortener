FROM python:3.9.0-alpine AS base
WORKDIR /opt/app
COPY ./requirements.txt ./requirements.txt
COPY ./urlshortener ./urlshortener
COPY ./config.py ./config.py
COPY ./run.py ./run.py
RUN pip install -r requirements.txt

FROM base as test
COPY . .
RUN pip install -r requirements-test.txt
CMD pylint urlshortener/ && pytest --cov urlshortener/ --cov-fail-under=90

FROM base as local
CMD gunicorn --bind=0.0.0.0:8000 --workers=4 --reload --preload run:app

FROM base
RUN rm ./requirements.txt
CMD gunicorn --workers=4 --preload run:app
