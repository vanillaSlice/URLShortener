# Grab the latest alpine image
FROM alpine:latest

# Install python runtime
RUN apk --update add python3 py-pip py-gunicorn py-psycopg2 bash 

# Install dependencies
COPY ./requirements.txt /opt/URLShortener/requirements.txt
RUN pip install -qr /opt/URLShortener/requirements.txt

# Copy our code
COPY ./run.py /opt/URLShortener/run.py
COPY ./config.py /opt/URLShortener/config.py
COPY ./urlshortener /opt/URLShortener/urlshortener

# Run the app            
WORKDIR /opt/URLShortener
CMD gunicorn run:app --log-file -
