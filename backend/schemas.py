from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class RecordType(str, Enum):
    A = "A"
    AAAA = "AAAA"
    CNAME = "CNAME"
    TXT = "TXT"
    MX = "MX"
    NS = "NS"
    PTR = "PTR"
    SRV = "SRV"
    CAA = "CAA"


class HostedZoneBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    comment: str | None = Field(default=None, max_length=500)
    private_zone: bool = False


class HostedZoneCreate(HostedZoneBase):
    pass


class HostedZoneUpdate(BaseModel):
    comment: str | None = Field(default=None, max_length=500)
    private_zone: bool | None = None


class HostedZoneResponse(HostedZoneBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
    record_count: int = 0


class DNSRecordBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    record_type: RecordType
    ttl: int = Field(default=300, ge=1)
    value: str = Field(..., min_length=1)


class DNSRecordCreate(DNSRecordBase):
    pass


class DNSRecordUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    record_type: RecordType | None = None
    ttl: int | None = Field(default=None, ge=1)
    value: str | None = Field(default=None, min_length=1)


class DNSRecordResponse(DNSRecordBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    hosted_zone_id: str
    created_at: datetime
    updated_at: datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    message: str


class PaginatedHostedZones(BaseModel):
    items: list[HostedZoneResponse]
    total: int
    skip: int
    limit: int


class PaginatedDNSRecords(BaseModel):
    items: list[DNSRecordResponse]
    total: int
    skip: int
    limit: int
