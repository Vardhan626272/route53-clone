"use client";

import { useState } from "react";

import { ConfirmModal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import type { DNSRecord } from "@/lib/types";
import { deleteDnsRecord } from "@/services/dns-records.service";

interface DeleteRecordModalProps {
  open: boolean;
  zoneId: string;
  record: DNSRecord | null;
  onClose: () => void;
  onDeleted: (recordId: string) => void;
}

export function DeleteRecordModal({
  open,
  zoneId,
  record,
  onClose,
  onDeleted,
}: DeleteRecordModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!record) return;

    setLoading(true);
    try {
      await deleteDnsRecord(zoneId, record.id);
      showToast(`Record "${record.name}" deleted`, "success");
      onDeleted(record.id);
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to delete record"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmModal
      open={open}
      title="Delete record"
      message={`Are you sure you want to delete the ${record?.record_type ?? ""} record "${record?.name}"?`}
      confirmLabel="Delete record"
      loading={loading}
      onConfirm={handleDelete}
      onClose={onClose}
    />
  );
}
