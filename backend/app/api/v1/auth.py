from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    create_refresh_token, decode_token, get_current_user,
    generate_password_reset_token,
)
from app.schemas.auth import (
    LoginRequest, TokenResponse, TokenRefreshRequest,
    UserCreate, UserResponse, ChangePasswordRequest,
    PasswordResetRequest, PasswordResetConfirm,
)
from app.models.hr import Employee

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee).where(Employee.email == request.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(request.password, user.employee_code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=30,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: TokenRefreshRequest):
    payload = decode_token(request.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=400, detail="Invalid refresh token")
    access_token = create_access_token(data={"sub": payload["sub"]})
    new_refresh = create_refresh_token(data={"sub": payload["sub"]})
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
        expires_in=30,
    )


@router.post("/register", response_model=UserResponse)
async def register(request: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee).where(Employee.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = Employee(
        employee_code=f"EMP-{request.email[:5].upper()}",
        email=request.email,
        first_name=request.first_name,
        last_name=request.last_name,
        phone=request.phone,
        role=request.role,
        joining_date=None,
        basic_salary=0,
        total_salary=0,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: Employee = Depends(get_current_user),
):
    if not verify_password(request.current_password, current_user.employee_code):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.employee_code = get_password_hash(request.new_password)
    return {"message": "Password changed successfully"}


@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    token = generate_password_reset_token(request.email)
    return {"message": "Password reset email sent", "token": token}


@router.post("/reset-password")
async def reset_password(request: PasswordResetConfirm, db: AsyncSession = Depends(get_db)):
    payload = decode_token(request.token)
    if payload.get("type") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid reset token")
    result = await db.execute(select(Employee).where(Employee.email == payload["sub"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.employee_code = get_password_hash(request.new_password)
    await db.commit()
    return {"message": "Password reset successful"}
