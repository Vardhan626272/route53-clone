"use client";

import { useState } from "react";

import { ConfirmModal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import type { HostedZone } from "@/lib/types";
import { deleteHostedZone } from "@/services/hosted-zones.service";

interface DeleteHostedZoneModalProps {
  open: boolean;
  zone: HostedZone | null;
  onClose: () => void;
  onDeleted: (zoneId: string) => void;
}

export function DeleteHostedZoneModal({
  open,
  zone,
  onClose,
  onDeleted,
}: DeleteHostedZoneModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!zone) return;

    setLoading(true);
    try {
      await deleteHostedZone(zone.id);
      showToast(`Hosted zone "${zone.name}" deleted`, "success");
      onDeleted(zone.id);
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to delete hosted zone"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmModal
      open={open}
      title="Delete hosted zone"
      message={`Are you sure you want to delete "${zone?.name}"? All DNS records in this hosted zone will also be deleted.`}
      confirmLabel="Delete hosted zone"
      loading={loading}
      onConfirm={handleDelete}
      onClose={onClose}
    />
  );
}
