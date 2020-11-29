class Default:

    DEBUG = False
    ENV = 'production'
    MONGODB_HOST = 'mongodb://127.0.0.1:27017/urlshortener'
    SECRET_KEY = 'default secret key'
    SERVER_NAME = '127.0.0.1:5000'
    SESSION_COOKIE_DOMAIN = '127.0.0.1:5000'
    SSL = True


class Test:

    DEBUG = True
    ENV = 'test'
    MONGODB_HOST = 'mongomock://localhost'
