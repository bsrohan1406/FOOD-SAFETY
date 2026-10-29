from flask import Blueprint, render_template
from flask_login import login_required, current_user
from app.security import roles_required
from app.models import Grievance, AuditLog

bp = Blueprint("admin", __name__, url_prefix="/admin")

@bp.route("/audit")
@login_required
@roles_required("admin")
def audit():
    entries = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(300).all()
    return render_template("audit.html", entries=entries)
