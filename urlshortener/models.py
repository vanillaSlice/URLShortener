"""
Exports URLShortener app data models.
"""

from mongoengine import Document, URLField

class URLEntry(Document):
    url = URLField(required=True)

    meta = {"collection": "url_map"}
