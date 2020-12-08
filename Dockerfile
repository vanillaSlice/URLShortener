FROM python:3.9.1-alpine AS base
WORKDIR /opt/app
COPY ./config.py ./config.py
COPY ./requirements.txt ./requirements.txt
COPY ./run.py ./run.py
COPY ./urlshortener ./urlshortener
RUN pip install -r requirements.txt

FROM base as test
COPY ./.coveragerc ./.coveragerc
COPY ./pytest.ini ./pytest.ini
COPY ./test-requirements.txt ./test-requirements.txt
COPY ./unit_tests ./unit_tests
RUN pip install -r test-requirements.txt
CMD flake8 && pytest

FROM base as local
CMD gunicorn --bind=0.0.0.0:8000 --workers=4 --reload --preload run:app

FROM base
RUN rm ./requirements.txt
CMD gunicorn --workers=4 --preload run:app
