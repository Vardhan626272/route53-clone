export type RecordType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "TXT"
  | "MX"
  | "NS"
  | "PTR"
  | "SRV"
  | "CAA";

export const RECORD_TYPES: RecordType[] = [
  "A",
  "AAAA",
  "CNAME",
  "TXT",
  "MX",
  "NS",
  "PTR",
  "SRV",
  "CAA",
];

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface HostedZone {
  id: string;
  name: string;
  comment: string | null;
  private_zone: boolean;
  created_at: string;
  updated_at: string;
  record_count: number;
}

export interface HostedZoneCreate {
  name: string;
  comment?: string | null;
  private_zone?: boolean;
}

export interface HostedZoneUpdate {
  comment?: string | null;
  private_zone?: boolean;
}

export interface DNSRecord {
  id: string;
  hosted_zone_id: string;
  name: string;
  record_type: RecordType;
  ttl: number;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface DNSRecordCreate {
  name: string;
  record_type: RecordType;
  ttl?: number;
  value: string;
}

export interface DNSRecordUpdate {
  name?: string;
  record_type?: RecordType;
  ttl?: number;
  value?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ListParams {
  skip?: number;
  limit?: number;
  q?: string;
}
