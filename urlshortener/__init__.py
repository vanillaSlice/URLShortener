"""
Exports a function to create an instance of the URL Shortener app.
"""

import os

from flask import Flask, render_template
from flask_assets import Environment
from flask_mongoengine import MongoEngine

from urlshortener.assets import bundles
from urlshortener.version import __version__

assets = Environment()

mongoengine = MongoEngine()


def create_app(testing=False):
    """
    Creates an instance of the URL Shortener app.
    """

    app = Flask(__name__, instance_relative_config=True)

    # load default config
    app.config.from_object('config.Default')

    # load instance config (if present)
    app.config.from_pyfile('config.py', silent=True)

    # load test config (if testing)
    if testing:
        app.config.from_object('config.Test')

    app.config.update({'TESTING': testing})

    # load environment variables (if present)
    app.config.update({
        'DEBUG':
            os.environ.get('DEBUG', str(app.config.get('DEBUG'))).lower()
            == 'true',
        'ENV': os.environ.get('ENV', app.config.get('ENV')),
        'MONGODB_HOST':
            os.environ.get('MONGODB_HOST', app.config.get('MONGODB_HOST')),
        'SECRET_KEY':
            os.environ.get('SECRET_KEY', app.config.get('SECRET_KEY')),
        'SERVER_NAME':
            os.environ.get('SERVER_NAME', app.config.get('SERVER_NAME')),
        'SESSION_COOKIE_DOMAIN':
            os.environ.get('SESSION_COOKIE_DOMAIN',
                           app.config.get('SESSION_COOKIE_DOMAIN')),
        'SSL':
            os.environ.get('SSL', str(app.config.get('SSL'))).lower() == 'true'
    })

    # set version
    app.config.update({
        'VERSION': __version__
    })

    # init extensions
    assets.init_app(app)
    mongoengine.init_app(app)

    # disable strict trailing slashes
    app.url_map.strict_slashes = False

    # register blueprints
    from urlshortener.blueprints import home
    app.register_blueprint(home)

    # register asset bundles
    assets.register(bundles)

    # attach 404 error handler
    @app.errorhandler(404)
    def handle_404(error):
        return render_template('404.html', error=error), 404

    # attach 500 error handler
    @app.errorhandler(500)
    def handle_500(error):
        return render_template('500.html', error=error), 500

    # disable caching when debugging
    if app.debug:
        @app.after_request
        def after_request(response):
            response.headers['Cache-Control'] = \
                'no-cache, no-store, must-revalidate'
            response.headers['Expires'] = 0
            response.headers['Pragma'] = 'no-cache'
            return response

    return app
