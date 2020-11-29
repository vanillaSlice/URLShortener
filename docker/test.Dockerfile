FROM python:3.9.0-alpine
WORKDIR /opt/app
COPY . .
RUN pip install -r requirements.txt -r requirements-test.txt
CMD pylint urlshortener/ && pytest --cov urlshortener/ --cov-fail-under=90
