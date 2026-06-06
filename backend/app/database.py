import uuid
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy.types import TypeDecorator, CHAR
from app.config import settings

try:
    from redis import asyncio as aioredis
    redis_client = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
    )
except ImportError:
    redis_client = None

try:
    from celery import Celery
    celery_app = Celery(
        "car_showroom",
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND,
    )
    celery_app.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="Asia/Dubai",
        enable_utc=True,
        task_track_started=True,
        task_time_limit=30 * 60,
        task_soft_time_limit=15 * 60,
    )
except ImportError:
    celery_app = None


class UUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def __init__(self, as_uuid=True):
        self.as_uuid = as_uuid
        super().__init__()

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            from sqlalchemy.dialects.postgresql import UUID as PG_UUID
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if dialect.name == 'postgresql':
            return value if isinstance(value, uuid.UUID) else uuid.UUID(str(value))
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))


if "sqlite" in settings.database_url_async:
    engine = create_async_engine(
        settings.database_url_async,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_async_engine(
        settings.database_url_async,
        echo=settings.DEBUG,
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True,
    )

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    await engine.dispose()
    if redis_client:
        await redis_client.close()


class RedisService:
    @staticmethod
    async def get(key: str):
        return await redis_client.get(key)

    @staticmethod
    async def set(key: str, value: str, expire: int = 3600):
        await redis_client.setex(key, expire, value)

    @staticmethod
    async def delete(key: str):
        await redis_client.delete(key)

    @staticmethod
    async def exists(key: str) -> bool:
        return await redis_client.exists(key) > 0
