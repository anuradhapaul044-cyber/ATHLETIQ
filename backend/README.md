# ATHLETIQ backend

Minimal FastAPI foundation for the ATHLETIQ API. It currently exposes only a health check; database access, authentication, frontend API calls, and business features are intentionally not implemented.

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

## Temporary authentication

`POST /auth/register` creates a student account in memory. `POST /auth/login`
returns a bearer JWT. The store resets whenever the server restarts.

Local test accounts are available only until database-backed user management is
implemented:

- `anuradha` / `stringst`
- `demo.student` / `DemoStudent123!`
- `demo.coach` / `DemoCoach123!`
- `demo.admin` / `DemoAdmin123!`

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
