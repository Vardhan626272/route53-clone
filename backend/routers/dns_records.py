from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

import crud
from database import get_db
from schemas import DNSRecordCreate, DNSRecordResponse, DNSRecordUpdate, PaginatedDNSRecords

router = APIRouter(
    prefix="/hosted-zones/{zone_id}/records",
    tags=["DNS Records"],
)


@router.post("", response_model=DNSRecordResponse, status_code=status.HTTP_201_CREATED)
def create_dns_record(
    zone_id: str,
    data: DNSRecordCreate,
    db: Session = Depends(get_db),
) -> DNSRecordResponse:
    record = crud.create_dns_record(db, zone_id, data)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone '{zone_id}' not found",
        )
    return crud.dns_record_to_response(record)


@router.get("", response_model=PaginatedDNSRecords)
def list_dns_records(
    zone_id: str,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records to return"),
    q: str | None = Query(None, description="Search records by name, type, or value"),
    db: Session = Depends(get_db),
) -> PaginatedDNSRecords:
    result = crud.get_dns_records(db, zone_id, skip=skip, limit=limit, q=q)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone '{zone_id}' not found",
        )

    records, total = result
    return PaginatedDNSRecords(
        items=[crud.dns_record_to_response(record) for record in records],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{record_id}", response_model=DNSRecordResponse)
def get_dns_record(
    zone_id: str,
    record_id: str,
    db: Session = Depends(get_db),
) -> DNSRecordResponse:
    record = crud.get_dns_record(db, zone_id, record_id)
    if record is None:
        if crud.get_hosted_zone(db, zone_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Hosted zone '{zone_id}' not found",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"DNS record '{record_id}' not found in hosted zone '{zone_id}'",
        )
    return crud.dns_record_to_response(record)


@router.patch("/{record_id}", response_model=DNSRecordResponse)
def update_dns_record(
    zone_id: str,
    record_id: str,
    data: DNSRecordUpdate,
    db: Session = Depends(get_db),
) -> DNSRecordResponse:
    record = crud.update_dns_record(db, zone_id, record_id, data)
    if record is None:
        if crud.get_hosted_zone(db, zone_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Hosted zone '{zone_id}' not found",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"DNS record '{record_id}' not found in hosted zone '{zone_id}'",
        )
    return crud.dns_record_to_response(record)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dns_record(
    zone_id: str,
    record_id: str,
    db: Session = Depends(get_db),
) -> Response:
    deleted = crud.delete_dns_record(db, zone_id, record_id)
    if not deleted:
        if crud.get_hosted_zone(db, zone_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Hosted zone '{zone_id}' not found",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"DNS record '{record_id}' not found in hosted zone '{zone_id}'",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
