from flask import Blueprint, jsonify, request, redirect
from flask_jwt_extended import create_access_token
from app.models import db, User

auth = Blueprint('auth', __name__, url_prefix='')


@auth.route('/signup', methods=['POST'])
def signup():
    incoming = request.get_json()

    user = User(
        username=incoming['username'],
        password=incoming['password']
    )

    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message='User already exists'), 409

    token = create_access_token(identity=user.username)
    return jsonify(user=user.to_dict(), token=token)


@auth.route('/session', methods=['PUT'])
def login():
    incoming = request.get_json()
    user = User.query.filter_by(username=incoming['username']).one()
    if user and user.check_password(incoming['password']):
        token = create_access_token(identity=user.username)
        return jsonify(user=user.to_dict(), token=token)
    else:
        return {'msg': 'Incorrect username or password'}, 400
