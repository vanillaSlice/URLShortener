"""
Exports an instance of URLShortener app. If run with 'python run.py',
the Flask development server will start running the app on
'localhost:5000'.
"""

from urlshortener import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
