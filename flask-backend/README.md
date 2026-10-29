# Food Safety Sentinel — production-oriented starter

This repository upgrades the local demo into a role-aware Flask application with SQLAlchemy models, private evidence storage, CSRF protection, rate limiting, security headers, audit events, a PostgreSQL Docker setup, and a local SQLite option.

**This is a starter, not a finished or certified public service. Do not deploy it for real citizen complaints until the launch checklist below is completed.** It is not an official government portal.

## Features included
- Citizen, officer and administrator roles.
- Password hashing and login throttling; CSRF protection on forms.
- SQLite for local development; PostgreSQL through `DATABASE_URL` in deployment.
- Grievance records, evidence metadata, possible duplicate flag, priority triage, officer proof submission, separate admin review, escalation and append-only-style audit events.
- Private file storage served only after login and authorization checks.
- Demo wallet ledger entries only; no withdrawal or money movement.
- Dockerfile and docker-compose with PostgreSQL.

## Local setup (Windows / VS Code)
Use Python 3.11 or 3.12.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and set `SECRET_KEY` to a random long value. For local-only demo use:
```env
SECRET_KEY=replace-this-with-a-long-random-secret
DATABASE_URL=sqlite:///sentinel.db
FLASK_DEBUG=true
DEMO_LOGIN_ENABLED=true
COOKIE_SECURE=false
```

Initialize tables and demo accounts:
```powershell
$env:FLASK_APP="run.py"
flask init-db
flask seed-demo
python run.py
```

Open http://127.0.0.1:5000.

### Demo accounts
The seed command creates these email addresses but does **not** set passwords:
- `citizen@example.test`
- `officer@example.test`
- `admin@example.test`

For a local demo, set passwords with a short Python shell after seeding:

```powershell
python
```
```python
from app import create_app, db
from app.models import User
app = create_app()
with app.app_context():
    for email, password in [
        ("citizen@example.test", "Citizen-Demo-Password-2026!"),
        ("officer@example.test", "Officer-Demo-Password-2026!"),
        ("admin@example.test", "Admin-Demo-Password-2026!"),
    ]:
        user = User.query.filter_by(email=email).first()
        user.set_password(password)
        user.is_verified = True
    db.session.commit()
exit()
```

If login says verification is required, this is intentionally protective; only use demo bypass settings in a local environment. Never use the demo bypass on a public site.

## Docker (production-shaped test)
1. Copy `.env.example` to `.env`.
2. Set a long random `SECRET_KEY` and `POSTGRES_PASSWORD`.
3. Set `OTP_PROVIDER=unconfigured` until you implement a provider.
4. Run:
```bash
docker compose up --build
```
5. App listens on http://localhost:8000. This is still a deployment test, not public launch; configure a reverse proxy/HTTPS and a proper migration process.

## Integrations not yet live
- OTP: the code contains a provider boundary but no SMS/email provider adapter. Do not use console OTP in production.
- FSSAI: seeded records are fabricated samples. Add an authorized and legally approved source/API; do not scrape or present demo records as official.
- Aadhaar/PAN: deliberately not collected. Only implement identity verification through lawful, authorized flows after legal review and a clear necessity assessment.
- Maps/geolocation: location is currently a free-text field. Add opt-in location permission and an approved maps provider if needed.
- CV/OCR: not implemented. Add model inference, image quality checks, human review and error handling before relying on image or invoice signals.
- Payments: wallet ledger is only a demo accounting record. A compliant payout provider, KYC/AML review where applicable, fraud controls and reconciliation are required for actual money.
- Timelines: escalation is manual; no scheduler/notification service is connected.

## Production launch checklist
Before opening the site to the public:
1. Obtain legal/privacy review, establish the operator's authority, terms, privacy notice, grievance handling policy, retention schedule and consent.
2. Create a data-protection impact assessment. Minimize collection; avoid Aadhaar, PAN and bank details unless specifically lawful and necessary.
3. Configure verified email/mobile OTP using an approved provider, account recovery, session invalidation, role approval and MFA for officers/admins.
4. Replace local file storage with private object storage, virus scanning, content sniffing, signed/authorized downloads, encryption and retention/deletion workflows.
5. Add database migrations (Alembic/Flask-Migrate), backups, restore tests, monitoring, alerting, error reporting and incident response.
6. Use HTTPS, secure cookies, secret manager, least-privilege database credentials, dependency scanning, penetration testing, CSRF/CORS review, rate limits and bot/abuse controls.
7. Add a trusted official data source and documented legal-jurisdiction rules with human review; never auto-reject solely from a model.
8. Implement notifications, case SLAs, reliable scheduled escalation, immutable audit retention and access reviews.
9. Threat-model evidence tampering, retaliation, malicious/false complaints, duplicate abuse and officer collusion.
10. Verify accessibility, language support, mobile camera UX and performance.
11. Add automated unit/integration tests and run them in CI before every deployment.
12. Deploy under an organization-controlled domain and do not imply government endorsement unless formally authorized.

## Security notes
This starter provides baseline protections, but is not a security audit. Do not place secrets in source control. Do not expose the database publicly. Configure `COOKIE_SECURE=true` only behind HTTPS. `flask db.create_all()` is used for simple bootstrap; production schema changes should use migrations. Use a managed Postgres database and private storage with backups for production.

Reference for legal context: https://fssai.gov.in/cms/food-safety-and-standards-act-2006.php
