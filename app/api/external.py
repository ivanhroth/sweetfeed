from flask import Blueprint, jsonify
from app.models import Collection, Feed
import requests as req

external_routes = Blueprint('data', __name__)

@external_routes.route('/feedsearch/<str:domain>')
def search_feed(domain):
    r = req.get('https://feedsearch.dev/api/v1/search?url=' + domain)
    return r.data
