# Grab the latest alpine image
FROM alpine:latest

# Install python runtime
RUN apk --update add python3 py-pip py-gunicorn py-psycopg2 bash 

# Install dependencies
ADD ./requirements.txt /opt/URLShortener/requirements.txt
RUN pip install -qr /opt/URLShortener/requirements.txt

# Copy our code
COPY . /opt/URLShortener/

# Run the app            
WORKDIR /opt/URLShortener
CMD gunicorn run:APP --log-file -
