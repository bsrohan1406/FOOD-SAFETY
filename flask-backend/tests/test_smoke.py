import os
import tempfile
import pytest
from app import create_app, db

@pytest.fixture()
def app():
    temp = tempfile.TemporaryDirectory()
    app = create_app()
    app.config.update(TESTING=True, WTF_CSRF_ENABLED=False, SQLALCHEMY_DATABASE_URI="sqlite:///" + os.path.join(temp.name, "test.db"))
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()
    temp.cleanup()

def test_health(app):
    client = app.test_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"

def test_home(app):
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert b"Food Safety Sentinel" in response.data
