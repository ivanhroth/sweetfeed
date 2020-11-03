from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    # email = db.Column(db.String(255), nullable=False, unique=True)

    collections = db.relationship("Collection")

    def to_dict(self):
        return {
          "id": self.id,
          "username": self.username,
          # "email": self.email
        }


class Collection(db.Model):
    __tablename__ = 'collections'

    id = db.Column(db.Integer, db.ForeignKey("User.id") primary_key=True)
    user_id = db.Column(db.Integer)

    owner = db.relationship("User")
    feeds = db.relationship("Feed", secondary=collection_feeds_table)


collection_feeds_table = db.Table('collection_feeds_table',
                                  db.Column(db.Integer,
                                            db.ForeignKey("Collection.id"))
                                  db.Column(db.Integer,
                                            db.ForeignKey("Feed.id")))


class Feed(db.Model):
    __tablename__ = "feeds"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(75))
    url = db.Column(db.String(280), nullable=False)
