import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_jwt_extended import JWTManager

from app.models import db, User
from app.api.user_routes import user_routes
from app.api.auth import auth
from app.api.data import data_routes
from app.api.external import external_routes

from app.config import Config

app = Flask(__name__)

jwt = JWTManager(app)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth)
app.register_blueprint(data_routes)
app.register_blueprint(external_routes)
db.init_app(app)

# Application Security
CORS(app)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
                        generate_csrf(),
                        secure=True if os.environ.get('FLASK_ENV') else False,
                        samesite='Strict' if os.environ.get('FLASK_ENV')
                                 else None,
                        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')
