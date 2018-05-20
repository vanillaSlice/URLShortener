"""
Exports URLShortener app data models.
"""

from mongoengine import Document, SequenceField, URLField

class URLEntry(Document):
    _id = URLField(required=True)
    sequence = SequenceField()

    meta = {"collection": "url_map"}
