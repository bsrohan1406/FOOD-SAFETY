import os
from datetime import timedelta
from flask import Flask, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix

db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()
limiter = Limiter(key_func=get_remote_address, default_limits=["300 per hour"])

def create_app():
    app = Flask(
        __name__,
        template_folder="../templates",
        static_folder="../static"
    )
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-only-change-me")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///sentinel.db")
    if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
        app.config["SQLALCHEMY_DATABASE_URI"] = app.config["SQLALCHEMY_DATABASE_URI"].replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["MAX_CONTENT_LENGTH"] = int(os.environ.get("MAX_UPLOAD_MB", "8")) * 1024 * 1024
    app.config["UPLOAD_FOLDER"] = os.environ.get("UPLOAD_FOLDER", os.path.join(app.instance_path, "private_uploads"))
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
    app.config["REMEMBER_COOKIE_HTTPONLY"] = True
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=8)
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.instance_path, exist_ok=True)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    csrf.init_app(app)
    limiter.init_app(app)

    from app.models import User
    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    from app.auth import bp as auth_bp
    from app.grievances import bp as grievance_bp
    from app.admin import bp as admin_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(grievance_bp)
    app.register_blueprint(admin_bp)

    @app.after_request
    def security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(self)"
        if os.environ.get("COOKIE_SECURE", "false").lower() == "true":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    @app.cli.command("init-db")
    def init_db_command():
        """Create tables for a local/demo environment. Use Alembic migrations in production."""
        with app.app_context():
            db.create_all()
            print("Database tables created.")

    @app.cli.command("seed-demo")
    def seed_demo_command():
        """Create demo accounts and fabricated business records. Never use these in production."""
        from app.models import Business, User
        with app.app_context():
            if not Business.query.first():
                db.session.add_all([
                    Business(name="Demo Spice Kitchen", address="Sample address", license_number="DEMO-1001", license_status="SAMPLE_VALID"),
                    Business(name="Fresh Bowl Cafe", address="Sample address", license_number=None, license_status="SAMPLE_UNKNOWN"),
                    Business(name="Sunrise Sweets", address="Sample address", license_number="DEMO-1003", license_status="SAMPLE_EXPIRED"),
                ])
            for email, name, role in [
                ("citizen@example.test", "Demo Citizen", "citizen"),
                ("officer@example.test", "Demo Officer", "officer"),
                ("admin@example.test", "Demo Administrator", "admin"),
            ]:
                if not User.query.filter_by(email=email).first():
                    db.session.add(User(name=name, email=email, phone=None, role=role, is_verified=True))
            db.session.commit()
            print("Seeded demo users. Login is disabled by default; set DEMO_LOGIN_ENABLED=true only for local testing.")

    return app
