"""
Exports URLShortener app blueprints.
"""

from flask import Blueprint, current_app, jsonify, redirect, render_template, request
from bson.objectid import ObjectId
from mongoengine.errors import DoesNotExist, ValidationError

from .models import URLEntry

home = Blueprint("home", __name__, url_prefix="/")

@home.route("/")
def index():
    return render_template("home.html", app_url=get_app_url())

@home.route("/new/<path:url>")
def new_url(url):
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
    try:
        return redirect(URLEntry.objects.get(sequence=sequence)._id)
    except Exception:
        return jsonify({"error": "url does not exist in the database"}), 400

def get_app_url():
    if current_app.config.get("SSL"):
        return request.host_url.replace("http://", "https://")
    else:
        return request.host_url
