"""
Exports URLShortener app blueprints.
"""

from flask import Blueprint, jsonify, redirect, render_template, request, url_for
from bson.objectid import ObjectId
from mongoengine.errors import DoesNotExist, ValidationError

from .models import URLEntry

home = Blueprint("home", __name__, url_prefix="/")

@home.route("/")
def index():
    return render_template("home.html")

@home.route("/new/<path:url>")
def new_url(url):
    try:
        entry = URLEntry.objects.get(_id=url)
    except DoesNotExist:
        try:
            entry = URLEntry(url).save()
        except ValidationError:
            return jsonify({"error": "invalid url"}), 400
    return jsonify({"original_url": url, "short_url": request.host_url + str(entry.sequence)}), 200

@home.route("/<sequence>")
def go_to_url(sequence):
    try:
        return redirect(URLEntry.objects.get(sequence=sequence)._id)
    except:
        return jsonify({"error": "url does not exist in the database"}), 400
