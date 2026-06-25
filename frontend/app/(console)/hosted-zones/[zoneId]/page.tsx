"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CreateRecordModal } from "@/components/dns-records/CreateRecordModal";
import { DeleteRecordModal } from "@/components/dns-records/DeleteRecordModal";
import { EditRecordModal } from "@/components/dns-records/EditRecordModal";
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
import type { DNSRecord, HostedZone } from "@/lib/types";
import { listDnsRecords } from "@/services/dns-records.service";
import { getHostedZone } from "@/services/hosted-zones.service";

const PAGE_SIZE = 10;

export default function HostedZoneDetailPage() {
  const params = useParams<{ zoneId: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const zoneId = params.zoneId;

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("");
  const [loadingZone, setLoadingZone] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<DNSRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<DNSRecord | null>(null);

  useEffect(() => {
    const loadZone = async () => {
      setLoadingZone(true);
      try {
        const response = await getHostedZone(zoneId);
        setZone(response);
      } catch (error) {
        showToast(getErrorMessage(error, "Hosted zone not found"), "error");
        router.push("/hosted-zones");
      } finally {
        setLoadingZone(false);
      }
    };

    void loadZone();
  }, [zoneId, router, showToast]);

  const loadRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const response = await listDnsRecords(zoneId, {
        skip,
        limit: PAGE_SIZE,
        q: search.trim() || undefined,
      });
      setRecords(response.items);
      setTotal(response.total);
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to load DNS records"), "error");
    } finally {
      setLoadingRecords(false);
    }
  }, [zoneId, skip, search, showToast]);

  useEffect(() => {
    if (!loadingZone && zone) {
      void loadRecords();
    }
  }, [loadRecords, loadingZone, zone]);

  const handleSearchChange = (value: string) => {
    setSkip(0);
    setSearch(value);
  };

  if (loadingZone) {
    return <TableSkeleton rows={4} />;
  }

  if (!zone) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 text-sm text-aws-text-secondary">
        <Link href="/hosted-zones" className="text-aws-link hover:underline">
          Hosted zones
        </Link>
        <span className="mx-2">/</span>
        <span>{zone.name}</span>
      </div>

      <PageHeader
        title={zone.name}
        description={zone.comment || "Manage DNS records for this hosted zone."}
        actions={
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            Create record
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Panel className="p-4">
          <p className="text-xs uppercase tracking-wide text-aws-muted">Hosted zone ID</p>
          <p className="mt-2 text-sm font-medium text-aws-text">{zone.id}</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs uppercase tracking-wide text-aws-muted">Zone type</p>
          <div className="mt-2">
            <Badge tone={zone.private_zone ? "warning" : "success"}>
              {zone.private_zone ? "Private hosted zone" : "Public hosted zone"}
            </Badge>
          </div>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs uppercase tracking-wide text-aws-muted">Record count</p>
          <p className="mt-2 text-sm font-medium text-aws-text">{zone.record_count}</p>
        </Panel>
      </div>

      <Panel>
        <PanelToolbar>
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Filter records by name, type, or value"
          />
          <p className="text-sm text-aws-text-secondary">{total} records</p>
        </PanelToolbar>

        {loadingRecords ? <TableSkeleton rows={6} /> : null}

        {!loadingRecords && records.length === 0 ? (
          <EmptyState
            title="No records found"
            description={
              search
                ? "No DNS records match your search filter."
                : "Create a record to start routing traffic for this hosted zone."
            }
            actionLabel={search ? undefined : "Create record"}
            onAction={search ? undefined : () => setCreateOpen(true)}
          />
        ) : null}

        {!loadingRecords && records.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <Th>Record name</Th>
                <Th>Type</Th>
                <Th>TTL</Th>
                <Th>Value</Th>
                <Th className="text-right">Actions</Th>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-[#fafafa]">
                    <Td className="font-medium">{record.name}</Td>
                    <Td>
                      <Badge>{record.record_type}</Badge>
                    </Td>
                    <Td>{record.ttl}</Td>
                    <Td className="max-w-md break-all">{record.value}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="link" size="sm" onClick={() => setEditRecord(record)}>
                          Edit
                        </Button>
                        <Button variant="link" size="sm" onClick={() => setDeleteRecord(record)}>
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

      <CreateRecordModal
        open={createOpen}
        zoneId={zoneId}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setSkip(0);
          void loadRecords();
          void getHostedZone(zoneId).then(setZone);
        }}
      />
      <EditRecordModal
        open={Boolean(editRecord)}
        zoneId={zoneId}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onUpdated={() => void loadRecords()}
      />
      <DeleteRecordModal
        open={Boolean(deleteRecord)}
        zoneId={zoneId}
        record={deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onDeleted={() => {
          void loadRecords();
          void getHostedZone(zoneId).then(setZone);
        }}
      />
    </div>
  );
}
