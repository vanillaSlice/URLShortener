"""
Contains default and test config properties. To add local instance
config properties create a file 'instance/config.py' or export the
properties as environment variables (note that environment variables
will take precedence).
"""

class Default(object):
    """Default config properties."""
    DEBUG = True
    SECRET_KEY = "default secret key"
    SERVER_NAME = "localhost:5000"
    MONGODB_DB = "urlshortener"
    MONGODB_HOST = "localhost"
    MONGODB_PORT = 27017
    MONGODB_USERNAME = ""
    MONGODB_PASSWORD = ""

class Test(Default):
    """Test config properties."""
    MONGODB_DB = "urlshortener_test"