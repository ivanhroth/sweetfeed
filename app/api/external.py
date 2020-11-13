from flask import Blueprint, jsonify
from app.models import Collection, Feed
import requests as req
import feedparser

external_routes = Blueprint('external', __name__)


@external_routes.route('/feedsearch/<domain>')
def search_feed(domain):
    r = req.get('https://feedsearch.dev/api/v1/search?url=' + domain)
    r.raise_for_status()
    print(r.json())
    return {"feeds": r.json()}


@external_routes.route('/feedcontent/<int:id>')
def retrieve_feed_content(id):
    feed = Feed.query.filter_by(id=id).one()
    feed_url = feed.url
    return jsonify(feedparser.parse(feed_url))
