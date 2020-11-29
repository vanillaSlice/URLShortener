"""
Exports URL Shortener app data models.
"""

from mongoengine import Document, SequenceField, URLField


class URLEntry(Document):
    """
    URL entry used in database.
    """

    _id = URLField(required=True)
    sequence = SequenceField()

    meta = {'collection': 'url_map'}

    def get_url(self):
        """
        Returns the URL.
        """

        return self._id
