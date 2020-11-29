FROM python:3.9.0-alpine AS test
WORKDIR /opt/app
COPY . .
RUN pip install -r requirements.txt -r requirements-test.txt
CMD pylint urlshortener/ && pytest --cov urlshortener/ --cov-fail-under=90

FROM python:3.9.0-alpine
WORKDIR /opt/app
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
RUN rm ./requirements.txt
COPY ./urlshortener ./urlshortener
COPY ./config.py ./config.py
COPY ./run.py ./run.py
CMD gunicorn --workers=4 --preload run:app
