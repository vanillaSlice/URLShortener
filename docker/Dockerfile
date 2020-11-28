FROM python:3.9.0-alpine
WORKDIR /opt/app
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
RUN rm ./requirements.txt
COPY ./urlshortener ./urlshortener
COPY ./config.py ./config.py
COPY ./run.py ./run.py
CMD gunicorn --workers=4 run:app
