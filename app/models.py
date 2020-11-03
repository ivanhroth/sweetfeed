from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    # email = db.Column(db.String(255), nullable=False, unique=True)

    def to_dict(self):
        return {
          "id": self.id,
          "username": self.username,
          # "email": self.email
        }


class Collection(db.Model):
    __tablename__ = 'collections'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)


class CollectionFeed(db.Model):
    __tablename__ = "collection_feeds"

    collection_id = db.Column(db.Integer)
    feed_id = db.Column(db.Integer)


class Feed(db.Model):
    __tablename__ = "feeds"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(75))
    url = db.Column(db.String(280), nullable=False)
