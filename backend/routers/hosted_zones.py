from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

import crud
from database import get_db
from schemas import (
    HostedZoneCreate,
    HostedZoneResponse,
    HostedZoneUpdate,
    PaginatedHostedZones,
)

router = APIRouter(prefix="/hosted-zones", tags=["Hosted Zones"])


@router.post("", response_model=HostedZoneResponse, status_code=status.HTTP_201_CREATED)
def create_hosted_zone(
    data: HostedZoneCreate,
    db: Session = Depends(get_db),
) -> HostedZoneResponse:
    zone = crud.create_hosted_zone(db, data)
    if zone is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A hosted zone named '{data.name}' already exists",
        )
    return crud.hosted_zone_to_response(zone, record_count=0)


@router.get("", response_model=PaginatedHostedZones)
def list_hosted_zones(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records to return"),
    q: str | None = Query(None, description="Search hosted zones by domain name"),
    db: Session = Depends(get_db),
) -> PaginatedHostedZones:
    zones, total = crud.get_hosted_zones(db, skip=skip, limit=limit, q=q)
    record_counts = crud.get_record_counts_for_zones(db, [zone.id for zone in zones])
    return PaginatedHostedZones(
        items=[
            crud.hosted_zone_to_response(zone, record_count=record_counts.get(zone.id, 0))
            for zone in zones
        ],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{zone_id}", response_model=HostedZoneResponse)
def get_hosted_zone(
    zone_id: str,
    db: Session = Depends(get_db),
) -> HostedZoneResponse:
    zone = crud.get_hosted_zone(db, zone_id)
    if zone is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone '{zone_id}' not found",
        )
    record_counts = crud.get_record_counts_for_zones(db, [zone.id])
    return crud.hosted_zone_to_response(zone, record_count=record_counts.get(zone.id, 0))


@router.patch("/{zone_id}", response_model=HostedZoneResponse)
def update_hosted_zone(
    zone_id: str,
    data: HostedZoneUpdate,
    db: Session = Depends(get_db),
) -> HostedZoneResponse:
    zone = crud.update_hosted_zone(db, zone_id, data)
    if zone is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone '{zone_id}' not found",
        )
    record_counts = crud.get_record_counts_for_zones(db, [zone.id])
    return crud.hosted_zone_to_response(zone, record_count=record_counts.get(zone.id, 0))


@router.delete("/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hosted_zone(
    zone_id: str,
    db: Session = Depends(get_db),
) -> Response:
    deleted = crud.delete_hosted_zone(db, zone_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone '{zone_id}' not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
