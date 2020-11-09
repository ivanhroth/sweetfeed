from flask import Blueprint, jsonify
from app.models import Collection

data_routes = Blueprint('data', __name__)


@data_routes.route('/collections/<int:id>')
def get_collection(id):
    collection = Collection.query.filter_by(id=id).one()
    return jsonify({
        "name": collection.name,
        "id": collection.id,
        "user_id": collection.user_id
    })
