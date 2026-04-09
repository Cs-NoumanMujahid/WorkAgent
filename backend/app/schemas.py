from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional


TaskStatus = Literal["pending", "in-progress", "completed", "overdue"]
TaskPriority = Literal["low", "medium", "high"]
UserRole = Literal["user", "admin"]


class UserOut(BaseModel):
    id: str
    fullName: str
    email: EmailStr
    role: UserRole
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    createdAt: str
    updatedAt: str


class AuthLoginIn(BaseModel):
    email: EmailStr
    password: str


class AuthRegisterIn(BaseModel):
    fullName: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)


class AuthLoginOut(BaseModel):
    token: str
    user: UserOut


class ChangePasswordIn(BaseModel):
    currentPassword: str
    newPassword: str = Field(min_length=8)


class UpdateProfileIn(BaseModel):
    fullName: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None


class TaskOut(BaseModel):
    id: str
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    category: str
    dueDate: str
    createdBy: str
    assignedTo: Optional[str] = None
    createdAt: str
    updatedAt: str


class TaskCreateIn(BaseModel):
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    dueDate: datetime
    priority: TaskPriority
    status: TaskStatus
    category: str = Field(min_length=1)
    assignedTo: Optional[str] = None


class TaskUpdateIn(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    dueDate: Optional[datetime] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    category: Optional[str] = None
    assignedTo: Optional[str] = None

