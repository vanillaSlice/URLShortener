"""
Exports URLShortener app blueprints.
"""

from flask import Blueprint, current_app, jsonify, redirect, render_template, request
from mongoengine.errors import DoesNotExist, ValidationError

from .models import URLEntry

home = Blueprint("home", __name__, url_prefix="/")

@home.route("/")
def index():
    """
    Index route.
    """

    return render_template("home.html", app_url=get_app_url())

@home.route("/new/<path:url>")
def new_url(url):
    """
    New URL route.
    """

    try:
        entry = URLEntry.objects.get(_id=url)
    except DoesNotExist:
        try:
            entry = URLEntry(url).save()
        except ValidationError:
            return jsonify({"error": "invalid url"}), 400
    return jsonify({"original_url": url, "short_url": get_app_url() + str(entry.sequence)}), 200

@home.route("/<sequence>")
def go_to_url(sequence):
    """
    Go to URL route.
    """

    url_entry = URLEntry.objects(sequence=sequence).first()
    if url_entry:
        return redirect(url_entry.get_url())
    else:
        return jsonify({"error": "url does not exist in the database"}), 400

def get_app_url():
    """
    Returns app URL.
    """

    if current_app.config.get("SSL"):
        return request.host_url.replace("http://", "https://")
    else:
        return request.host_url
