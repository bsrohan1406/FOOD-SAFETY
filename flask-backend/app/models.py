from datetime import datetime, timezone
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

def utcnow():
    return datetime.now(timezone.utc)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(254), unique=True, index=True, nullable=True)
    phone = db.Column(db.String(30), unique=True, index=True, nullable=True)
    role = db.Column(db.String(20), nullable=False, default="citizen")
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    def check_password(self, password):
        return bool(self.password_hash and check_password_hash(self.password_hash, password))

class OTPChallenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String(254), nullable=False, index=True)
    code_hash = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    attempts = db.Column(db.Integer, default=0, nullable=False)
    consumed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

class Business(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(180), nullable=False, index=True)
    address = db.Column(db.String(300))
    license_number = db.Column(db.String(100))
    license_status = db.Column(db.String(40), nullable=False, default="UNKNOWN")
    source = db.Column(db.String(100), default="UNVERIFIED")
    checked_at = db.Column(db.DateTime(timezone=True))

class Grievance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(24), unique=True, index=True, nullable=False)
    citizen_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    business_id = db.Column(db.Integer, db.ForeignKey("business.id"), nullable=True)
    business_name = db.Column(db.String(180), nullable=False)
    issue_type = db.Column(db.String(20), nullable=False)
    keyword = db.Column(db.String(180), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location_text = db.Column(db.String(300))
    priority = db.Column(db.String(20), nullable=False, default="Medium")
    status = db.Column(db.String(40), nullable=False, default="Submitted")
    assigned_officer_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    possible_duplicate_of = db.Column(db.Integer, db.ForeignKey("grievance.id"), nullable=True)
    invoice_key = db.Column(db.String(300))
    evidence_key = db.Column(db.String(300), nullable=False)
    evidence_sha256 = db.Column(db.String(64), index=True, nullable=False)
    warning_reported = db.Column(db.String(40), default="No")
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    business = db.relationship("Business")
    citizen = db.relationship("User", foreign_keys=[citizen_id])
    officer = db.relationship("User", foreign_keys=[assigned_officer_id])
    evidence = db.relationship("Evidence", backref="grievance", cascade="all, delete-orphan")
    def __repr__(self):
        return f"<Grievance {self.public_id}>"

class Evidence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    grievance_id = db.Column(db.Integer, db.ForeignKey("grievance.id"), nullable=False, index=True)
    uploader_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    object_key = db.Column(db.String(300), nullable=False)
    original_name = db.Column(db.String(255), nullable=False)
    sha256 = db.Column(db.String(64), nullable=False, index=True)
    evidence_type = db.Column(db.String(30), nullable=False, default="CITIZEN")
    review_status = db.Column(db.String(30), nullable=False, default="PENDING")
    review_note = db.Column(db.String(500))
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

class WalletTransaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    grievance_id = db.Column(db.Integer, db.ForeignKey("grievance.id"), nullable=True)
    amount_paise = db.Column(db.Integer, nullable=False)
    kind = db.Column(db.String(20), nullable=False)
    note = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    action = db.Column(db.String(100), nullable=False)
    target_type = db.Column(db.String(50), nullable=False)
    target_id = db.Column(db.String(100), nullable=False)
    detail = db.Column(db.String(500))
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
