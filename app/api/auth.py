from flask import Blueprint, jsonify, request, redirect
from flask_jwt_extended import create_access_token
from app.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__, url_prefix='')


@auth.route('/signup', methods=['POST'])
def signup():
    incoming = request.get_json()

    user = User(
        username=incoming['username'],
        hashed_password=generate_password_hash(incoming['password'])
    )

    db.session.add(user)

    try:
        db.session.commit()
    except:
        return jsonify(message='Error'), 409

    token = create_access_token(identity=user.username)
    return jsonify(user=user.to_dict(), token=token)


@auth.route('/session', methods=['PUT'])
def login():
    incoming = request.get_json()
    user = User.query.filter_by(username=incoming['username']).one()
    print(user)
    if user and \
       check_password_hash(user.hashed_password, incoming['password']):
        token = create_access_token(identity=user.username)
        return jsonify(user=user.to_dict(), token=token)
    else:
        return {'msg': 'Incorrect username or password'}, 400
