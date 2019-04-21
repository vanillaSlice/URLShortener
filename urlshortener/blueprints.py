"""
Exports URL Shortener app blueprints.
"""

import re

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

@home.route('/new/<path:path>')
def new_url(path):
    """
    Saves a new URL to the database and returns the short URL.
    """

    request_path = '{}/new/'.format(request.url_root)
    request_url_index_start = request.url.find(request_path) + len(request_path)
    request_url = request.url[request_url_index_start:].strip()
    request_url_without_prefixes = re.sub(r'^(http(s)?://)?(www.)?', '', request_url)

    server_name = current_app.config.get('SERVER_NAME')

    if request_url_without_prefixes.startswith(server_name):
        return jsonify({'error': 'That is already a shortened link'}), 400

    url_entry = URLEntry.objects(_id=request_url).first()

    if not url_entry:
        try:
            url_entry = URLEntry(request_url).save()
        except ValidationError:
            return jsonify({'error': 'Invalid URL'}), 400

    if current_app.config.get('SSL'):
        app_url = request.host_url.replace('http://', 'https://')
    else:
        app_url = request.host_url

    encoded_sequence = hex(url_entry.sequence)[2:]

    return jsonify({'original_url': request_url, 'short_url': app_url + encoded_sequence}), 200

@home.route('/<sequence>')
def go_to_url(sequence):
    """
    Redirects to URL in database with given sequence.
    """

    try:
        decoded_sequence = int(sequence, 16)
    except ValueError:
        return abort(404)

    url_entry = URLEntry.objects(sequence=decoded_sequence).first()

    if url_entry:
        return redirect(url_entry.get_url())
    else:
        return abort(404)
