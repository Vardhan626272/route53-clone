import { apiClient } from "@/lib/api-client";
import type {
  DNSRecord,
  DNSRecordCreate,
  DNSRecordUpdate,
  ListParams,
  PaginatedResponse,
} from "@/lib/types";

export async function listDnsRecords(
  zoneId: string,
  params: ListParams = {},
): Promise<PaginatedResponse<DNSRecord>> {
  const { data } = await apiClient.get<PaginatedResponse<DNSRecord>>(
    `/hosted-zones/${zoneId}/records`,
    { params },
  );
  return data;
}

export async function createDnsRecord(
  zoneId: string,
  payload: DNSRecordCreate,
): Promise<DNSRecord> {
  const { data } = await apiClient.post<DNSRecord>(
    `/hosted-zones/${zoneId}/records`,
    payload,
  );
  return data;
}

export async function updateDnsRecord(
  zoneId: string,
  recordId: string,
  payload: DNSRecordUpdate,
): Promise<DNSRecord> {
  const { data } = await apiClient.patch<DNSRecord>(
    `/hosted-zones/${zoneId}/records/${recordId}`,
    payload,
  );
  return data;
}

export async function deleteDnsRecord(zoneId: string, recordId: string): Promise<void> {
  await apiClient.delete(`/hosted-zones/${zoneId}/records/${recordId}`);
}
