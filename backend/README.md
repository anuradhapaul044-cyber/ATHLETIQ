# ATHLETIQ backend

FastAPI backend for the ATHLETIQ application, including PostgreSQL-backed
users, JWT authentication, role-based authorization, assessments, coach
workflows, opportunities, and administrative APIs.

## Setup

From the project root, create the existing Python environment if it does not already exist:

```powershell
python -m venv ai-env
```

Install the backend dependencies into that environment:

```powershell
.\ai-env\Scripts\python.exe -m pip install -r backend\requirements.txt
```

## Run

```powershell
.\ai-env\Scripts\python.exe -m uvicorn backend.app.main:app --reload
```

The health check is available at `http://127.0.0.1:8000/health`.

## Authentication

`POST /auth/register` creates a user in PostgreSQL. The request accepts
`username`, `password`, and an optional `role` (`student`, `coach`, or
`admin`). Omitting `role` preserves backwards compatibility and creates a
student. The frontend signup flow intentionally exposes only Student and Coach
registration; administrative accounts should be created through the existing
administrative provisioning workflow rather than public signup.

`POST /auth/login` returns a bearer JWT containing the persisted username and
role. Protected routes validate both the token and the current database role.
The OpenAPI schema documents the role enum on registration and login responses.
The public frontend intentionally exposes only Student and Coach signup;
administrative accounts remain API-supported for controlled provisioning and
tests.

Do not rely on demo credentials or username conventions. Create test users via
the registration endpoint or the focused backend tests.

Set `ATHLETIQ_JWT_SECRET` before deployment. Without it, a local-only signing
secret is generated at startup and existing tokens expire on restart.

## Push-up assessment

`POST /assessments/pushup` accepts a multipart `video` upload from an
authenticated student. It saves the file only for the duration of analysis,
then returns the existing push-up analyzer's repetition, elbow-angle, pose,
and movement-consistency metrics.

## Layout

- `app/api/routes/` — HTTP route modules; future auth, assessment, athlete, coach, opportunity, and admin endpoints belong here.
- `app/services/` — future AI orchestration and domain services, including calls to `ai/pushup_analyzer.py`.
- `app/schemas/` — future request and response models.
- `app/core/` — future configuration, security, and shared infrastructure.
