from flask import Blueprint, jsonify
from app.models import Collection, Feed

data_routes = Blueprint('data', __name__)


@data_routes.route('/collections/<int:id>')
def get_collection(id):
    collection = Collection.query.filter_by(id=id).one()
    return jsonify({
        "name": collection.name,
        "id": collection.id,
        "user_id": collection.user_id,
        "feeds": list(map(lambda feed: {"id": feed.id,
                                        "name": feed.name,
                                        "url": feed.url}, collection.feeds))
    })
