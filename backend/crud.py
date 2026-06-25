import secrets
import string

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from models import DNSRecord, HostedZone, utcnow
from schemas import (
    DNSRecordCreate,
    DNSRecordResponse,
    DNSRecordUpdate,
    HostedZoneCreate,
    HostedZoneResponse,
    HostedZoneUpdate,
)


def _generate_id(prefix: str, length: int = 13) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return prefix + "".join(secrets.choice(alphabet) for _ in range(length))


def get_record_counts_for_zones(db: Session, zone_ids: list[str]) -> dict[str, int]:
    if not zone_ids:
        return {}

    rows = db.execute(
        select(DNSRecord.hosted_zone_id, func.count(DNSRecord.id))
        .where(DNSRecord.hosted_zone_id.in_(zone_ids))
        .group_by(DNSRecord.hosted_zone_id)
    ).all()
    return {zone_id: count for zone_id, count in rows}


def hosted_zone_to_response(
    zone: HostedZone,
    record_count: int | None = None,
) -> HostedZoneResponse:
    return HostedZoneResponse(
        id=zone.id,
        name=zone.name,
        comment=zone.comment,
        private_zone=zone.private_zone,
        created_at=zone.created_at,
        updated_at=zone.updated_at,
        record_count=record_count if record_count is not None else len(zone.records),
    )


def dns_record_to_response(record: DNSRecord) -> DNSRecordResponse:
    return DNSRecordResponse.model_validate(record)


def create_hosted_zone(db: Session, data: HostedZoneCreate) -> HostedZone | None:
    existing = db.scalar(select(HostedZone).where(HostedZone.name == data.name))
    if existing:
        return None

    zone = HostedZone(
        id=_generate_id("Z"),
        name=data.name,
        comment=data.comment,
        private_zone=data.private_zone,
    )
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone


def get_hosted_zone(db: Session, zone_id: str) -> HostedZone | None:
    return db.scalar(select(HostedZone).where(HostedZone.id == zone_id))


def get_hosted_zones(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 50,
    q: str | None = None,
) -> tuple[list[HostedZone], int]:
    filters = []
    if q:
        filters.append(HostedZone.name.ilike(f"%{q}%"))

    total = db.scalar(select(func.count(HostedZone.id)).where(*filters)) or 0
    zones = db.scalars(
        select(HostedZone)
        .where(*filters)
        .order_by(HostedZone.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).all()
    return list(zones), total


def update_hosted_zone(
    db: Session,
    zone_id: str,
    data: HostedZoneUpdate,
) -> HostedZone | None:
    zone = get_hosted_zone(db, zone_id)
    if not zone:
        return None

    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(zone, field, value)
    zone.updated_at = utcnow()

    db.commit()
    db.refresh(zone)
    return zone


def delete_hosted_zone(db: Session, zone_id: str) -> bool:
    zone = get_hosted_zone(db, zone_id)
    if not zone:
        return False

    db.delete(zone)
    db.commit()
    return True


def create_dns_record(
    db: Session,
    zone_id: str,
    data: DNSRecordCreate,
) -> DNSRecord | None:
    zone = get_hosted_zone(db, zone_id)
    if not zone:
        return None

    record = DNSRecord(
        id=_generate_id("R"),
        hosted_zone_id=zone_id,
        name=data.name,
        record_type=data.record_type.value,
        ttl=data.ttl,
        value=data.value,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_dns_record(db: Session, zone_id: str, record_id: str) -> DNSRecord | None:
    return db.scalar(
        select(DNSRecord).where(
            DNSRecord.id == record_id,
            DNSRecord.hosted_zone_id == zone_id,
        )
    )


def get_dns_records(
    db: Session,
    zone_id: str,
    *,
    skip: int = 0,
    limit: int = 50,
    q: str | None = None,
) -> tuple[list[DNSRecord], int] | None:
    if not get_hosted_zone(db, zone_id):
        return None

    filters = [DNSRecord.hosted_zone_id == zone_id]
    if q:
        search = f"%{q}%"
        filters.append(
            or_(
                DNSRecord.name.ilike(search),
                DNSRecord.record_type.ilike(search),
                DNSRecord.value.ilike(search),
            )
        )

    total = db.scalar(select(func.count(DNSRecord.id)).where(*filters)) or 0
    records = db.scalars(
        select(DNSRecord)
        .where(*filters)
        .order_by(DNSRecord.name.asc(), DNSRecord.record_type.asc())
        .offset(skip)
        .limit(limit)
    ).all()
    return list(records), total


def update_dns_record(
    db: Session,
    zone_id: str,
    record_id: str,
    data: DNSRecordUpdate,
) -> DNSRecord | None:
    record = get_dns_record(db, zone_id, record_id)
    if not record:
        return None

    updates = data.model_dump(exclude_unset=True)
    if "record_type" in updates and updates["record_type"] is not None:
        updates["record_type"] = updates["record_type"].value

    for field, value in updates.items():
        setattr(record, field, value)
    record.updated_at = utcnow()

    db.commit()
    db.refresh(record)
    return record


def delete_dns_record(db: Session, zone_id: str, record_id: str) -> bool:
    record = get_dns_record(db, zone_id, record_id)
    if not record:
        return False

    db.delete(record)
    db.commit()
    return True
