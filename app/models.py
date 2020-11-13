from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


collection_feeds_table = db.Table('collection_feeds_table',
                                  db.Column(db.Integer,
                                            db.ForeignKey("collections.id"),
                                            name="collection_id"),
                                  db.Column(db.Integer,
                                            db.ForeignKey("feeds.id"),
                                            name="feed_id"))


# feed_entries_table = db.Table('feed_entries_table',
#                               db.Column(db.Integer,
#                                         db.ForeignKey('feeds.id'),
#                                         name='feed_id'),
#                               db.Column(db.Integer,
#                                         db.ForeignKey('entries.id'),
#                                         name='entry_id'))


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    collections = db.relationship("Collection")

    def to_dict(self):
        return {
          "id": self.id,
          "username": self.username,
        }


class Collection(db.Model):
    __tablename__ = 'collections'

    id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    user_id = db.Column(db.Integer)
    name = db.Column(db.String(140))

    owner = db.relationship("User")
    feeds = db.relationship("Feed", secondary=collection_feeds_table)


class Feed(db.Model):
    __tablename__ = "feeds"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(75))
    url = db.Column(db.String(280), nullable=False)
    collections = db.relationship("Collection",
                                  secondary=collection_feeds_table)
    entries = db.relationship('Entry', back_populates='feed')


class Entry(db.Model):
    __tablename__ = "entries"

    id = db.Column(db.Integer, primary_key=True)
    feed_id = db.Column(db.Integer, ForeignKey('feed.id'))
    url = db.Column(db.String(500), nullable=False)
    title = db.Column(db.String(280))
    content = db.Column(db.Text)
    published = db.Column(db.Date)

    feed = relationship('Feed', back_populates="entries")
