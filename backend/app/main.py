from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import settings
from app.db import Base, engine, SessionLocal
from app.models import User
from app.core.security import hash_password
from app.routers import auth as auth_router
from app.routers import tasks as tasks_router
from app.routers import admin as admin_router


def create_app() -> FastAPI:
    app = FastAPI(title="WorkAgent API", version="0.1.0")

    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router.router)
    app.include_router(tasks_router.router)
    app.include_router(admin_router.router)

    @app.get("/health")
    def health():
        return {"ok": True}

    return app


app = create_app()


def seed_dev_data():
    db: Session = SessionLocal()
    try:
        # Seed two users matching current frontend defaults
        existing_admin = db.execute(select(User).where(User.email == "admin@123.com")).scalar_one_or_none()
        if not existing_admin:
            db.add(
                User(
                    id="1",
                    full_name="Admin User",
                    email="admin@123.com",
                    role="admin",
                    password_hash=hash_password("passwordadmin"),
                )
            )
        existing_user = db.execute(select(User).where(User.email == "user@123.com")).scalar_one_or_none()
        if not existing_user:
            db.add(
                User(
                    id="2",
                    full_name="Regular User",
                    email="user@123.com",
                    role="user",
                    password_hash=hash_password("passworduser"),
                )
            )
        db.commit()
    finally:
        db.close()


Base.metadata.create_all(bind=engine)
seed_dev_data()

