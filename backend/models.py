from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    comment: Mapped[str | None] = mapped_column(String(500), nullable=True)
    private_zone: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    records: Mapped[list["DNSRecord"]] = relationship(
        "DNSRecord", back_populates="hosted_zone", cascade="all, delete-orphan"
    )


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    hosted_zone_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("hosted_zones.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    record_type: Mapped[str] = mapped_column(String(10), nullable=False)
    ttl: Mapped[int] = mapped_column(Integer, default=300, nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    hosted_zone: Mapped["HostedZone"] = relationship("HostedZone", back_populates="records")
