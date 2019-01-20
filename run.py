#!/usr/bin/env python3

"""
Exports an instance of the URL Shortener app. If run directly,
the Flask development server will start running the app on
'http://127.0.0.1:5000/'.
"""

from urlshortener import create_app

app = create_app()

if __name__ == '__main__':
    app.run()
