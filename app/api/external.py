from flask import Blueprint, jsonify
from app.models import Collection, Feed
import requests as req

external_routes = Blueprint('external', __name__)


@external_routes.route('/feedsearch/<domain>')
def search_feed(domain):
    r = req.get('https://feedsearch.dev/api/v1/search?url=' + domain)
    r.raise_for_status()
    return {"feeds": r.json()}
