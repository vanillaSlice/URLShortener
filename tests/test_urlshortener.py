import pytest

from urlshortener import create_app
from urlshortener.models import URLEntry

@pytest.fixture
def client():
    yield create_app(testing=True).test_client()

    # make sure we clear the database when we're done
    URLEntry.objects.delete()

def test_home(client):
    res = client.get('/')
    assert res.status_code == 200

def test_new_url_returns_short_url(client):
    original_url = 'https://www.placecage.com/200/300'
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert res.json['short_url'].endswith('/1')

def test_new_url_already_exists_returns_short_url(client):
    original_url = 'https://www.placecage.com/gif/284/196'
    URLEntry(original_url, sequence=1).save()
    res = client.get('/new/{}'.format(original_url))
    assert res.status_code == 200
    assert res.json['original_url'] == original_url
    assert res.json['short_url'].endswith('/1')

def test_new_url_invalid_returns_400(client):
    res = client.get('/new/invalid_url')
    assert res.status_code == 400

def test_go_to_url_redirects_to_url(client):
    URLEntry('https://www.placecage.com/g/155/300', sequence=1).save()
    res = client.get('/1')
    assert res.status_code == 302

def test_go_to_url_not_in_database_returns_404(client):
    res = client.get('/123456789')
    assert res.status_code == 404

def test_invalid_endpoint_returns_404(client):
    res = client.get('/invalid/endpoint')
    assert res.status_code == 404
