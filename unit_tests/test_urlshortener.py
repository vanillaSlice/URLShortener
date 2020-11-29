import pytest

from urlshortener import create_app
from urlshortener.models import URLEntry


@pytest.fixture
def app():
    yield create_app(testing=True)


@pytest.fixture
def client(app):
    yield app.test_client()

    # make sure we clear the database when we're done
    URLEntry.objects.delete()


def test_home(client):
    res = client.get('/')
    assert res.status_code == 200


def test_new_url_returns_short_url(client, app):
    original_url = 'https://www.placecage.com/200/300'
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert app.config['SERVER_NAME'] in res.json['short_url']


def test_new_url_already_exists_returns_short_url(client, app):
    original_url = 'https://www.placecage.com/200/300'
    URLEntry(_id=original_url, sequence=1).save()
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert app.config['SERVER_NAME'] in res.json['short_url']


def test_new_url_with_query_parameters_returns_short_url(client, app):
    original_url = 'https://www.youtube.com/watch?v=FyYMzEplnfU'
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert app.config['SERVER_NAME'] in res.json['short_url']


def test_new_url_with_query_params_exists_returns_short_url(client, app):
    original_url = 'https://www.youtube.com/watch?v=FyYMzEplnfU'
    URLEntry(_id=original_url, sequence=2).save()
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert app.config['SERVER_NAME'] in res.json['short_url']


def test_new_url_with_new_in_path_returns_short_url(client, app):
    original_url = 'https://www.google.com/new/'
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert app.config['SERVER_NAME'] in res.json['short_url']


def test_new_url_with_new_in_path_exists_returns_short_url(client, app):
    original_url = 'https://www.google.com/new/'
    URLEntry(_id=original_url, sequence=3).save()
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert app.config['SERVER_NAME'] in res.json['short_url']


def test_new_url_invalid_returns_400(client):
    res = client.get('/new/invalid_url')
    assert res.status_code == 400


def test_new_url_with_same_base_url_returns_400(client, app):
    res = client.get('/new/http://{}'.format(app.config['SERVER_NAME']))
    assert res.status_code == 400


def test_go_to_url_redirects_to_url(client):
    new_res = client.get('/new/https://www.placecage.com/g/155/300')
    short_url = new_res.json['short_url']
    path = short_url[short_url.rfind('/'):]
    res = client.get(path)
    assert res.status_code == 302


def test_go_to_url_not_in_database_returns_404(client):
    res = client.get('/123456789')
    assert res.status_code == 404


def test_invalid_endpoint_returns_404(client):
    res = client.get('/invalid/endpoint')
    assert res.status_code == 404
