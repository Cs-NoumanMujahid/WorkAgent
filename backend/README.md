# WorkAgent FastAPI Backend

## Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be on `http://localhost:8000`.

Seeded dev users:
- `admin@123.com` / `passwordadmin`
- `user@123.com` / `passworduser`

