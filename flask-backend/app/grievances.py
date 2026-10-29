import hashlib, os, secrets, uuid
from pathlib import Path
from datetime import datetime, timezone
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, send_file, abort
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from app import db, limiter
from app.models import User, Business, Grievance, Evidence, WalletTransaction, AuditLog
from app.security import roles_required

bp = Blueprint("grievances", __name__)
ALLOWED = {"jpg", "jpeg", "png", "webp", "pdf"}

def priority_for(text):
    text = text.lower()
    if any(w in text for w in ("poison", "hospitalized", "chemical contamination", "severe illness")): return "Critical"
    if any(w in text for w in ("expired", "mould", "mold", "worm", "insect", "unlicensed", "contamination")): return "High"
    if any(w in text for w in ("stale", "bad smell", "packaging")): return "Medium"
    return "Low"

def save_private_upload(file, allowed=ALLOWED):
    if not file or not file.filename or "." not in file.filename:
        raise ValueError("A file is required.")
    ext = file.filename.rsplit(".", 1)[1].lower()
    if ext not in allowed:
        raise ValueError("Unsupported file type.")
    raw = file.read()
    if not raw or len(raw) > current_app.config["MAX_CONTENT_LENGTH"]:
        raise ValueError("Empty or oversized file.")
    # Do not trust extension alone. Production should add malware scanning and MIME/signature checks.
    digest = hashlib.sha256(raw).hexdigest()
    key = f"{uuid.uuid4().hex}.{ext}"
    target = Path(current_app.config["UPLOAD_FOLDER"]) / key
    target.write_bytes(raw)
    return key, secure_filename(file.filename)[:255], digest

@bp.route("/")
def index():
    return render_template("landing.html")

@bp.route("/dashboard")
@login_required
def dashboard():
    if current_user.role == "officer":
        items = Grievance.query.order_by(Grievance.created_at.desc()).limit(100).all()
    elif current_user.role == "admin":
        items = Grievance.query.order_by(Grievance.created_at.desc()).limit(200).all()
    else:
        items = Grievance.query.filter_by(citizen_id=current_user.id).order_by(Grievance.created_at.desc()).all()
    balance = 0
    txns = WalletTransaction.query.filter_by(user_id=current_user.id).all()
    balance = sum(t.amount_paise for t in txns)
    return render_template("dashboard.html", grievances=items, balance=balance)

@bp.route("/grievances/new", methods=["GET", "POST"])
@login_required
@roles_required("citizen")
@limiter.limit("10 per hour")
def new_grievance():
    if request.method == "POST":
        business_name = request.form.get("business_name", "").strip()
        issue_type = request.form.get("issue_type", "Offline")
        keyword = request.form.get("keyword", "").strip()
        description = request.form.get("description", "").strip()
        location = request.form.get("location", "").strip()
        warning = request.form.get("warning_reported", "No")
        if not business_name or not keyword or len(description) < 20 or issue_type not in {"Online", "Offline"}:
            flash("Enter a business, keyword, valid issue type, and description of at least 20 characters.", "error")
            return render_template("new_grievance.html")
        if issue_type == "Online" and not request.files.get("invoice", None).filename:
            flash("Online complaints require an invoice.", "error")
            return render_template("new_grievance.html")
        try:
            evidence_key, evidence_name, evidence_hash = save_private_upload(request.files.get("evidence"), {"jpg","jpeg","png","webp"})
            invoice_key = None
            invoice = request.files.get("invoice")
            if invoice and invoice.filename:
                invoice_key, _, _ = save_private_upload(invoice)
        except (ValueError, AttributeError) as exc:
            flash(str(exc) or "Please attach valid evidence.", "error")
            return render_template("new_grievance.html")
        business = Business.query.filter(db.func.lower(Business.name) == business_name.lower()).first()
        priority = priority_for(keyword + " " + description)
        if business and business.license_status == "SAMPLE_EXPIRED": priority = "High"
        if business and business.license_status == "SAMPLE_UNKNOWN": priority = "High"
        duplicate = Grievance.query.filter_by(evidence_sha256=evidence_hash).filter(Grievance.status != "Settled").first()
        officer = User.query.filter_by(role="officer").first()
        g = Grievance(public_id="FS-" + secrets.token_hex(5).upper(), citizen_id=current_user.id,
            business_id=business.id if business else None, business_name=business_name, issue_type=issue_type,
            keyword=keyword, description=description, location_text=location, priority=priority,
            status="Under Review" if duplicate else "Submitted", assigned_officer_id=officer.id if officer else None,
            possible_duplicate_of=duplicate.id if duplicate else None, invoice_key=invoice_key,
            evidence_key=evidence_key, evidence_sha256=evidence_hash, warning_reported=warning)
        db.session.add(g); db.session.flush()
        db.session.add(Evidence(grievance_id=g.id, uploader_id=current_user.id, object_key=evidence_key,
                                original_name=evidence_name, sha256=evidence_hash, evidence_type="CITIZEN"))
        db.session.add(AuditLog(actor_id=current_user.id, action="GRIEVANCE_SUBMITTED", target_type="GRIEVANCE", target_id=g.public_id))
        if duplicate:
            duplicate.priority = "Critical"
            db.session.add(AuditLog(actor_id=current_user.id, action="POSSIBLE_DUPLICATE_FLAGGED", target_type="GRIEVANCE", target_id=g.public_id, detail=f"Potential match to {duplicate.public_id}"))
        db.session.commit()
        flash(f"Grievance {g.public_id} submitted. This is a demo workflow; official jurisdiction and business status require human/authorized verification.", "success")
        return redirect(url_for("grievances.dashboard"))
    return render_template("new_grievance.html")

@bp.route("/grievances/<int:grievance_id>/proof", methods=["POST"])
@login_required
@roles_required("officer")
@limiter.limit("20 per hour")
def upload_proof(grievance_id):
    g = db.session.get(Grievance, grievance_id)
    if not g: abort(404)
    try:
        key, original, digest = save_private_upload(request.files.get("proof"), {"jpg","jpeg","png","webp"})
    except ValueError as exc:
        flash(str(exc), "error"); return redirect(url_for("grievances.dashboard"))
    note = request.form.get("note", "").strip()[:500]
    ev = Evidence(grievance_id=g.id, uploader_id=current_user.id, object_key=key, original_name=original, sha256=digest, evidence_type="OFFICER_PROOF")
    g.status = "Awaiting Human Review"
    db.session.add(ev)
    db.session.add(AuditLog(actor_id=current_user.id, action="OFFICER_PROOF_UPLOADED", target_type="GRIEVANCE", target_id=g.public_id, detail=note))
    db.session.commit()
    flash("Proof submitted for independent review. Officer cannot self-settle the grievance.", "success")
    return redirect(url_for("grievances.dashboard"))

@bp.route("/grievances/<int:grievance_id>/review", methods=["POST"])
@login_required
@roles_required("admin")
def review(grievance_id):
    g = db.session.get(Grievance, grievance_id)
    if not g: abort(404)
    decision = request.form.get("decision")
    note = request.form.get("note", "").strip()[:500]
    if decision == "approve":
        g.status = "Settled"
        reward_rupees = {"Low": 50, "Medium": 100, "High": 200, "Critical": 300}.get(g.priority, 50)
        db.session.add(WalletTransaction(user_id=g.citizen_id, grievance_id=g.id, amount_paise=reward_rupees*100,
                                         kind="DEMO_CREDIT", note="Non-cash prototype credit after review"))
    elif decision == "reject":
        g.status = "Submitted"
        for ev in g.evidence:
            if ev.evidence_type == "OFFICER_PROOF":
                ev.review_status = "REJECTED"
                ev.review_note = note
    else:
        flash("Invalid review decision.", "error"); return redirect(url_for("grievances.dashboard"))
    db.session.add(AuditLog(actor_id=current_user.id, action="HUMAN_REVIEW_"+decision.upper(), target_type="GRIEVANCE", target_id=g.public_id, detail=note))
    db.session.commit()
    flash("Review saved. Any wallet credit is a demo ledger entry, not a cash payment.", "success")
    return redirect(url_for("grievances.dashboard"))

@bp.route("/grievances/<int:grievance_id>/escalate", methods=["POST"])
@login_required
@roles_required("officer", "admin")
def escalate(grievance_id):
    g = db.session.get(Grievance, grievance_id)
    if not g: abort(404)
    g.status = "Escalated"
    g.priority = "Critical"
    db.session.add(AuditLog(actor_id=current_user.id, action="GRIEVANCE_ESCALATED", target_type="GRIEVANCE", target_id=g.public_id))
    db.session.commit()
    flash("Grievance marked for state-authority escalation in this demo.", "success")
    return redirect(url_for("grievances.dashboard"))

@bp.route("/evidence/<int:evidence_id>")
@login_required
def evidence_file(evidence_id):
    ev = db.session.get(Evidence, evidence_id)
    if not ev: abort(404)
    g = ev.grievance
    allowed = current_user.role in {"admin","officer"} or g.citizen_id == current_user.id
    if not allowed: abort(403)
    path = Path(current_app.config["UPLOAD_FOLDER"]) / ev.object_key
    if not path.exists(): abort(404)
    return send_file(path, as_attachment=True, download_name=ev.original_name)

@bp.route("/health")
def health():
    return {"status": "ok", "service": "food-safety-sentinel", "integrations": "configure before production"}
