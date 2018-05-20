"""
Exports home routes.
"""

from flask import Blueprint, jsonify, redirect, render_template, url_for, request
from ..models import URLEntry
from bson.objectid import ObjectId
from mongoengine.errors import ValidationError

home = Blueprint("home", __name__, url_prefix="/")

@home.route("/")
def index():
    return render_template("home/index.html")

@home.route("/new/<path:url>")
def new_url(url):
    try:
        entry = URLEntry.objects.get(_id=url)
    except Exception:
        try:
            entry = URLEntry(url).save()
        except ValidationError:
            return jsonify({"error": "invalid url"}), 400
    short_url = request.host_url + str(entry.sequence)
    return jsonify({"original_url": url, "short_url": short_url}), 200

@home.route("/<sequence>")
def go_to(sequence):
    try:
        entry = URLEntry.objects.get(sequence=sequence)
        return redirect(entry._id)
    except:
        return jsonify({"error": "url doesn't exist"}), 400
