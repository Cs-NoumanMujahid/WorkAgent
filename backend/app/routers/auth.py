from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime, timezone

from app.db import get_db
from app.models import User
from app.schemas import (
    AuthLoginIn,
    AuthRegisterIn,
    AuthLoginOut,
    UserOut,
    ChangePasswordIn,
    UpdateProfileIn,
)
from app.core.security import hash_password, verify_password, create_access_token
from app.deps import get_current_user


router = APIRouter(prefix="/auth", tags=["auth"])


def to_user_out(u: User) -> UserOut:
    return UserOut(
        id=u.id,
        fullName=u.full_name,
        email=u.email,
        role=u.role,  # type: ignore
        phone=u.phone,
        bio=u.bio,
        avatar=u.avatar,
        createdAt=u.created_at.isoformat(),
        updatedAt=u.updated_at.isoformat(),
    )


@router.post("/register", response_model=UserOut)
def register(payload: AuthRegisterIn, db: Session = Depends(get_db)):
    existing = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        id=str(int(datetime.now(timezone.utc).timestamp() * 1000)),
        full_name=payload.fullName,
        email=payload.email,
        role="user",
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return to_user_out(user)


@router.post("/login", response_model=AuthLoginOut)
def login(payload: AuthLoginIn, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token(user.id)
    return AuthLoginOut(token=token, user=to_user_out(user))


@router.get("/me", response_model=UserOut)
def me(current: User = Depends(get_current_user)):
    return to_user_out(current)


@router.put("/me", response_model=UserOut)
def update_me(
    payload: UpdateProfileIn,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    if payload.email and payload.email != current.email:
        existing = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")

    if payload.fullName is not None:
        current.full_name = payload.fullName
    if payload.email is not None:
        current.email = payload.email
    if payload.phone is not None:
        current.phone = payload.phone
    if payload.bio is not None:
        current.bio = payload.bio
    if payload.avatar is not None:
        current.avatar = payload.avatar

    db.add(current)
    db.commit()
    db.refresh(current)
    return to_user_out(current)


@router.post("/change-password")
def change_password(
    payload: ChangePasswordIn,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    if not verify_password(payload.currentPassword, current.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current.password_hash = hash_password(payload.newPassword)
    db.add(current)
    db.commit()
    return {"success": True, "message": "Password changed successfully!"}

