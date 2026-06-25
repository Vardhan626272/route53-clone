"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CreateHostedZoneModal } from "@/components/hosted-zones/CreateHostedZoneModal";
import { DeleteHostedZoneModal } from "@/components/hosted-zones/DeleteHostedZoneModal";
import { EditHostedZoneModal } from "@/components/hosted-zones/EditHostedZoneModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/LoadingState";
import {
  Badge,
  PageHeader,
  Panel,
  PanelToolbar,
  Table,
  TableBody,
  TableHead,
  Td,
  Th,
} from "@/components/ui/PageShell";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import type { HostedZone } from "@/lib/types";
import { listHostedZones } from "@/services/hosted-zones.service";

const PAGE_SIZE = 10;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function HostedZonesPage() {
  const { showToast } = useToast();
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editZone, setEditZone] = useState<HostedZone | null>(null);
  const [deleteZone, setDeleteZone] = useState<HostedZone | null>(null);

  const loadZones = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listHostedZones({
        skip,
        limit: PAGE_SIZE,
        q: search.trim() || undefined,
      });
      setZones(response.items);
      setTotal(response.total);
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to load hosted zones"), "error");
    } finally {
      setLoading(false);
    }
  }, [skip, search, showToast]);

  useEffect(() => {
    void loadZones();
  }, [loadZones]);

  const handleSearchChange = (value: string) => {
    setSkip(0);
    setSearch(value);
  };

  return (
    <div>
      <PageHeader
        title="Hosted zones"
        description="A hosted zone is a container for DNS records that define how traffic is routed for a domain."
        actions={
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            Create hosted zone
          </Button>
        }
      />

      <Panel>
        <PanelToolbar>
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Filter by domain name"
          />
          <p className="text-sm text-aws-text-secondary">{total} hosted zones</p>
        </PanelToolbar>

        {loading ? <TableSkeleton rows={6} /> : null}

        {!loading && zones.length === 0 ? (
          <EmptyState
            title="No hosted zones"
            description={
              search
                ? "No hosted zones match your search. Try a different domain filter."
                : "Create a hosted zone to start managing DNS records for your domain."
            }
            actionLabel={search ? undefined : "Create hosted zone"}
            onAction={search ? undefined : () => setCreateOpen(true)}
          />
        ) : null}

        {!loading && zones.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <Th>Domain name</Th>
                <Th>Type</Th>
                <Th>Record count</Th>
                <Th>Comment</Th>
                <Th>Created</Th>
                <Th className="text-right">Actions</Th>
              </TableHead>
              <TableBody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-[#fafafa]">
                    <Td>
                      <Link
                        href={`/hosted-zones/${zone.id}`}
                        className="font-medium text-aws-link hover:underline"
                      >
                        {zone.name}
                      </Link>
                      <p className="mt-1 text-xs text-aws-muted">{zone.id}</p>
                    </Td>
                    <Td>
                      <Badge tone={zone.private_zone ? "warning" : "success"}>
                        {zone.private_zone ? "Private" : "Public"}
                      </Badge>
                    </Td>
                    <Td>{zone.record_count}</Td>
                    <Td className="max-w-xs truncate">{zone.comment || "—"}</Td>
                    <Td>{formatDate(zone.created_at)}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="link" size="sm" onClick={() => setEditZone(zone)}>
                          Edit
                        </Button>
                        <Button variant="link" size="sm" onClick={() => setDeleteZone(zone)}>
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </TableBody>
            </Table>
            <Pagination total={total} skip={skip} limit={PAGE_SIZE} onPageChange={setSkip} />
          </>
        ) : null}
      </Panel>

      <CreateHostedZoneModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setSkip(0);
          void loadZones();
        }}
      />
      <EditHostedZoneModal
        open={Boolean(editZone)}
        zone={editZone}
        onClose={() => setEditZone(null)}
        onUpdated={() => void loadZones()}
      />
      <DeleteHostedZoneModal
        open={Boolean(deleteZone)}
        zone={deleteZone}
        onClose={() => setDeleteZone(null)}
        onDeleted={() => void loadZones()}
      />
    </div>
  );
}
