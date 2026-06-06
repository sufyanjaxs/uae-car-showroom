import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declared_attr
from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class BaseModel(Base):
    __abstract__ = True

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = utcnow()

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class TenantMixin:
    @declared_attr
    def tenant_id(cls):
        return Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=True)

    @declared_attr
    def branch_id(cls):
        return Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=True)


class AuditMixin:
    @declared_attr
    def created_by(cls):
        return Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)

    @declared_attr
    def updated_by(cls):
        return Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)
