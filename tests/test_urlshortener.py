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

def test_invalid_endpoint_returns_404(client):
    res = client.get('/invalid/endpoint')
    assert res.status_code == 404
