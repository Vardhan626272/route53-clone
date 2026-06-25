import { apiClient } from "@/lib/api-client";
import type {
  HostedZone,
  HostedZoneCreate,
  HostedZoneUpdate,
  ListParams,
  PaginatedResponse,
} from "@/lib/types";

export async function listHostedZones(
  params: ListParams = {},
): Promise<PaginatedResponse<HostedZone>> {
  const { data } = await apiClient.get<PaginatedResponse<HostedZone>>("/hosted-zones", {
    params,
  });
  return data;
}

export async function getHostedZone(zoneId: string): Promise<HostedZone> {
  const { data } = await apiClient.get<HostedZone>(`/hosted-zones/${zoneId}`);
  return data;
}

export async function createHostedZone(payload: HostedZoneCreate): Promise<HostedZone> {
  const { data } = await apiClient.post<HostedZone>("/hosted-zones", payload);
  return data;
}

export async function updateHostedZone(
  zoneId: string,
  payload: HostedZoneUpdate,
): Promise<HostedZone> {
  const { data } = await apiClient.patch<HostedZone>(`/hosted-zones/${zoneId}`, payload);
  return data;
}

export async function deleteHostedZone(zoneId: string): Promise<void> {
  await apiClient.delete(`/hosted-zones/${zoneId}`);
}
