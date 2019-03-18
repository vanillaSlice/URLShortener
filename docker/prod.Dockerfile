FROM python:3.7.2-alpine

WORKDIR /opt/app

# Install the requirements
COPY ./requirements.txt ./requirements.txt
RUN pip install -qr requirements.txt
RUN rm ./requirements.txt

# Copy the code
COPY ./urlshortener ./urlshortener
COPY ./config.py ./config.py
COPY ./run.py ./run.py

# Run the app
CMD gunicorn --workers=4 run:app
