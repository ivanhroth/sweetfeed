from dotenv import load_dotenv
from app import app, db
from app.models import User

load_dotenv()

with app.app_context():
    db.drop_all()



    db.create_all()

    db.session.commit()
