from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, asc, desc
from datetime import datetime, time, timezone

from app.db import get_db
from app.models import Task, User
from app.schemas import TaskOut, TaskCreateIn, TaskUpdateIn, TaskStatus, TaskPriority
from app.deps import get_current_user, require_admin


router = APIRouter(prefix="/tasks", tags=["tasks"])


def to_task_out(t: Task) -> TaskOut:
    return TaskOut(
        id=t.id,
        title=t.title,
        description=t.description,
        status=t.status,  # type: ignore
        priority=t.priority,  # type: ignore
        category=t.category,
        dueDate=t.due_date.isoformat(),
        createdBy=t.created_by,
        assignedTo=t.assigned_to,
        createdAt=t.created_at.isoformat(),
        updatedAt=t.updated_at.isoformat(),
    )


@router.get("", response_model=list[TaskOut])
def list_tasks(
    q: str | None = None,
    status: TaskStatus | None = None,
    priority: TaskPriority | None = None,
    category: str | None = None,
    due_from: str | None = None,
    due_to: str | None = None,
    sort_by: str = Query("updatedAt", pattern="^(updatedAt|createdAt|dueDate|title|priority|status|category)$"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    def parse_date_range(value: str, end: bool) -> datetime:
        # Accept either full ISO datetime or YYYY-MM-DD (from HTML date inputs)
        try:
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            d = datetime.strptime(value, "%Y-%m-%d").date()
            dt = datetime.combine(d, time.max if end else time.min)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt

    stmt = select(Task)

    # Permissions: admin sees all; user sees created-by or assigned-to.
    if current.role != "admin":
        stmt = stmt.where(or_(Task.created_by == current.id, Task.assigned_to == current.id))

    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(or_(Task.title.ilike(like), Task.description.ilike(like), Task.category.ilike(like)))
    if status:
        stmt = stmt.where(Task.status == status)
    if priority:
        stmt = stmt.where(Task.priority == priority)
    if category and category.lower() != "all":
        stmt = stmt.where(Task.category == category)
    if due_from:
        stmt = stmt.where(Task.due_date >= parse_date_range(due_from, end=False))
    if due_to:
        stmt = stmt.where(Task.due_date <= parse_date_range(due_to, end=True))

    sort_map = {
        "updatedAt": Task.updated_at,
        "createdAt": Task.created_at,
        "dueDate": Task.due_date,
        "title": Task.title,
        "priority": Task.priority,
        "status": Task.status,
        "category": Task.category,
    }
    col = sort_map[sort_by]
    stmt = stmt.order_by(asc(col) if sort_dir == "asc" else desc(col))

    items = db.execute(stmt).scalars().all()
    return [to_task_out(t) for t in items]


@router.post("", response_model=TaskOut)
def create_task(
    payload: TaskCreateIn,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    assigned_to = payload.assignedTo
    if assigned_to and current.role != "admin":
        # non-admin cannot assign to other users
        assigned_to = None

    task = Task(
        id=str(int(datetime.utcnow().timestamp() * 1000)),
        title=payload.title,
        description=payload.description,
        status=payload.status,
        priority=payload.priority,
        category=payload.category,
        due_date=payload.dueDate,
        created_by=current.id,
        assigned_to=assigned_to,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return to_task_out(task)


def _get_task_or_404(db: Session, task_id: str) -> Task:
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


def _can_access(task: Task, user: User) -> bool:
    return user.role == "admin" or task.created_by == user.id or task.assigned_to == user.id


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    task = _get_task_or_404(db, task_id)
    if not _can_access(task, current):
        raise HTTPException(status_code=403, detail="Forbidden")
    return to_task_out(task)


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    payload: TaskUpdateIn,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    task = _get_task_or_404(db, task_id)
    if not _can_access(task, current):
        raise HTTPException(status_code=403, detail="Forbidden")

    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.status is not None:
        task.status = payload.status
    if payload.priority is not None:
        task.priority = payload.priority
    if payload.category is not None:
        task.category = payload.category
    if payload.dueDate is not None:
        task.due_date = payload.dueDate
    if payload.assignedTo is not None:
        if current.role != "admin":
            raise HTTPException(status_code=403, detail="Admin only assignment")
        task.assigned_to = payload.assignedTo

    db.add(task)
    db.commit()
    db.refresh(task)
    return to_task_out(task)


@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    task = _get_task_or_404(db, task_id)
    if not _can_access(task, current):
        raise HTTPException(status_code=403, detail="Forbidden")
    if current.role != "admin" and task.created_by != current.id:
        raise HTTPException(status_code=403, detail="Only creator can delete")

    db.delete(task)
    db.commit()
    return {"success": True}

