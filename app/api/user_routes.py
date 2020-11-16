from flask import Blueprint, jsonify
from app.models import User, Collection

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
def index():
    response = User.query.all()
    return {"users": [user.to_dict() for user in response]}


@user_routes.route('/<username>')
def get_user_by_name(username):
    response = User.query.filter_by(username=username).one()
    return jsonify(response.to_dict())


@user_routes.route('/<int:id>/collections')
def user_collections(id):
    user = User.query.filter_by(id=id).one()
    collections = Collection.query.filter_by(user_id=user.id).all()
    print(collections)
    return jsonify(list(map(lambda collection: {
        "name": collection.name,
        "id": collection.id,
        "user_id": collection.user_id,
        "feeds": list(map(lambda feed: {"id": feed.id,
                                        "name": feed.name,
                                        "url": feed.url}, collection.feeds))
    }, collections)))
