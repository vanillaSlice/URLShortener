"""
Exports a function to create an instance of URLShortener app.
"""

import os

from flask import Flask
from flask_mongoengine import MongoEngine

def create_app(testing=False):
    app = Flask(__name__, instance_relative_config=True)

    if testing:
        # load test config
        app.config.from_object("config.Test")
    else:
        # load default config
        app.config.from_object("config.Default")

        # load instance config (if present)
        app.config.from_pyfile("config.py", silent=True)

        # load environment variables (if present)
        app.config.update({
            "DEBUG": os.environ.get("DEBUG", str(app.config.get("DEBUG"))).lower() == "true",
            "SECRET_KEY": os.environ.get("SECRET_KEY", app.config.get("SECRET_KEY")),
            "SERVER_NAME": os.environ.get("SERVER_NAME", app.config.get("SERVER_NAME")),
            "MONGODB_DB": os.environ.get("MONGODB_DB", app.config.get("MONGODB_DB")),
            "MONGODB_HOST": os.environ.get("MONGODB_HOST", app.config.get("MONGODB_HOST")),
            "MONGODB_PORT": os.environ.get("MONGODB_PORT", app.config.get("MONGODB_PORT")),
            "MONGODB_USERNAME": os.environ.get("MONGODB_USERNAME", app.config.get("MONGODB_USERNAME")),
            "MONGODB_PASSWORD": os.environ.get("MONGODB_PASSWORD", app.config.get("MONGODB_PASSWORD"))
        })

    # connect to database
    MongoEngine(app)

    return app
