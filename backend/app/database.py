from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from redis import asyncio as aioredis
from celery import Celery
from app.config import settings

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

redis_client = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)

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
