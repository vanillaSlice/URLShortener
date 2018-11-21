FROM python:3.7-alpine

# Install the requirements
COPY ./requirements.txt /opt/URLShortener/requirements.txt
RUN pip install -qr /opt/URLShortener/requirements.txt

# Copy the code
COPY ./run.py /opt/URLShortener/run.py
COPY ./config.py /opt/URLShortener/config.py
COPY ./urlshortener /opt/URLShortener/urlshortener

# Run the app            
WORKDIR /opt/URLShortener
CMD gunicorn run:app
