
import os
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
from app import db, limiter
from app.models import User, AuditLog

bp = Blueprint("auth", __name__)


@bp.route("/register", methods=["GET", "POST"])
@limiter.limit("5 per hour")
def register():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        phone = request.form.get("phone", "").strip()
        password = request.form.get("password", "")

        if not name or not (email or phone) or len(password) < 12:
            flash(
                "Enter your name, email or phone, and a password "
                "of at least 12 characters.",
                "error"
            )
            return render_template("register.html")

        if (
            (email and User.query.filter_by(email=email).first())
            or (phone and User.query.filter_by(phone=phone).first())
        ):
            flash("An account with that email or phone already exists.", "error")
            return render_template("register.html")

        user = User(
            name=name,
            email=email or None,
            phone=phone or None,
            role="citizen",
            is_verified=True
        )
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        flash("Account created successfully! Please sign in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("register.html")


@bp.route("/login", methods=["GET", "POST"])
@limiter.limit("10 per minute")
def login():
    if request.method == "POST":
        identifier = request.form.get("identifier", "").strip().lower()
        password = request.form.get("password", "")

        user = User.query.filter(
            (User.email == identifier) | (User.phone == identifier)
        ).first()

        if user and user.check_password(password):
            login_user(user, remember=False, fresh=True)

            db.session.add(
                AuditLog(
                    actor_id=user.id,
                    action="LOGIN",
                    target_type="USER",
                    target_id=str(user.id)
                )
            )
            db.session.commit()

            return redirect(url_for("grievances.dashboard"))

        flash("Invalid credentials.", "error")

    return render_template("login.html")


@bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    flash("You have signed out.", "success")
    return redirect(url_for("index"))
