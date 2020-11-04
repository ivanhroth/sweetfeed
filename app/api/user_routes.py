from flask import Blueprint, jsonify
from app.models import User, Collection

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
def index():
    response = User.query.all()
    return {"users": [user.to_dict() for user in response]}


@user_routes.route('/<int:id>/collections')
def user_collections(id):
    const user = User.query.filter_by(id=id).one()
    const collections = Collection.query.filter_by(user_id=user.id).all()
    return jsonify(collections)
