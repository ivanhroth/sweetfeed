from flask import Blueprint, jsonify, request, redirect, url_for
from app.models import db, Collection, Feed
from sqlalchemy import delete

data_routes = Blueprint('data', __name__)


@data_routes.route('/collections/<int:id>')
def get_collection(id):
    collection = Collection.query.filter_by(id=id).one()
    return jsonify({
        "name": collection.name,
        "id": collection.id,
        "description": collection.description,
        "private": collection.private,
        "user_id": collection.user_id,
        "feeds": list(map(lambda feed: {"id": feed.id,
                                        "name": feed.name,
                                        "url": feed.url}, collection.feeds))
    })


@data_routes.route('/collections/<int:id>/addfeed', methods=['PUT'])
def add_feed(id):
    feed = request.get_json()
    current_collection = Collection.query.filter_by(id=id).one()
    new_feed = Feed(name=feed['title'], url=feed['url'])
    current_collection.feeds.append(new_feed)
    db.session.add(new_feed)
    db.session.commit()
    return jsonify({"msg": "Success"})


@data_routes.route('/collections/<int:id>/editname', methods=['PUT'])
def edit_name(id):
    name = request.get_json()['name']
    current_collection = Collection.query.filter_by(id=id).one()
    current_collection.name = name
    db.session.commit()
    return redirect(url_for('data.get_collection', id=id))


@data_routes.route('/collections/<int:id>/removefeed/<int:feedid>')
def remove_feed(id, feedid):
    collection = Collection.query.filter_by(id=id).one()
    feed = Feed.query.filter_by(id=feedid).one()
    collection.feeds.remove(feed)
    db.session.commit()
    return jsonify(list(map(lambda feed: {"id": feed.id,
                                          "name": feed.name,
                                          "url": feed.url}, collection.feeds)))


@data_routes.route('/collections/<int:id>/remove')
def remove_collection(id):
    collection = Collection.query.filter_by(id=id).one()
    db.session.delete(collection)
    db.session.commit()
    return jsonify({'msg': 'Success'})


@data_routes.route('/collections/<int:id>/update', methods=['PUT'])
def update_collection(id):
    new_data = request.get_json()
    collection = Collection.query.filter_by(id=id).one()
    keys = list(new_data.keys())
    for key in keys:
        exec("collection." + key + " = new_data[\"" + key + "\"]")
    db.session.commit()
    return jsonify({
        "name": collection.name,
        "id": collection.id,
        "description": collection.description,
        "private": collection.private,
        "user_id": collection.user_id,
        "feeds": list(map(lambda feed: {"id": feed.id,
                                        "name": feed.name,
                                        "url": feed.url}, collection.feeds))
    })
