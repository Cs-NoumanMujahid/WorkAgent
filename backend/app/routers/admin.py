from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, asc, desc

from app.db import get_db
from app.models import User
from app.schemas import UserOut
from app.deps import require_admin
from app.routers.auth import to_user_out


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserOut])
def list_users(
    q: str | None = None,
    role: str | None = None,
    sort_by: str = Query("createdAt", pattern="^(createdAt|updatedAt|fullName|email|role)$"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    stmt = select(User)

    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(or_(User.full_name.ilike(like), User.email.ilike(like)))
    if role and role != "All":
        stmt = stmt.where(User.role == role)

    sort_map = {
        "createdAt": User.created_at,
        "updatedAt": User.updated_at,
        "fullName": User.full_name,
        "email": User.email,
        "role": User.role,
    }
    col = sort_map[sort_by]
    stmt = stmt.order_by(asc(col) if sort_dir == "asc" else desc(col))

    users = db.execute(stmt).scalars().all()
    return [to_user_out(u) for u in users]


@router.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    u = db.get(User, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(u)
    db.commit()
    return {"success": True}


@router.patch("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    role = payload.get("role")
    if role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    if user_id == admin.id and role != "admin":
        raise HTTPException(status_code=400, detail="Cannot demote yourself")

    u = db.get(User, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u.role = role
    db.add(u)
    db.commit()
    db.refresh(u)
    return to_user_out(u)

