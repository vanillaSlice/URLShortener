"""
Exports URL Shortener app blueprints.
"""

from flask import abort, Blueprint, current_app, jsonify, redirect, render_template, request
from mongoengine.errors import ValidationError

from urlshortener.models import URLEntry

home = Blueprint('home', __name__, url_prefix='/')

@home.route('/')
def index():
    """
    Index route.
    """

    return render_template('home.html')

@home.route('/new/<path:url>')
def new_url(url):
    """
    Saves a new URL to the database and returns the short URL.
    """

    url_entry = URLEntry.objects(_id=url).first()
    if not url_entry:
        try:
            url_entry = URLEntry(url).save()
        except ValidationError:
            return jsonify({'error': 'Invalid URL'}), 400
    return jsonify({'original_url': url, 'short_url': get_app_url() + str(url_entry.sequence)}), 200

@home.route('/<int:sequence>')
def go_to_url(sequence):
    """
    Redirects to URL in database with given sequence.
    """

    url_entry = URLEntry.objects(sequence=sequence).first()
    if url_entry:
        return redirect(url_entry.get_url())
    else:
        return abort(404)

def get_app_url():
    """
    Returns the app URL.
    """

    if current_app.config.get('SSL'):
        return request.host_url.replace('http://', 'https://')
    else:
        return request.host_url
