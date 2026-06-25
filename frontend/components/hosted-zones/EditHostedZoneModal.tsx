"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { CheckboxField, InputField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import type { HostedZone } from "@/lib/types";
import { updateHostedZone } from "@/services/hosted-zones.service";

interface EditHostedZoneModalProps {
  open: boolean;
  zone: HostedZone | null;
  onClose: () => void;
  onUpdated: (zone: HostedZone) => void;
}

export function EditHostedZoneModal({
  open,
  zone,
  onClose,
  onUpdated,
}: EditHostedZoneModalProps) {
  const { showToast } = useToast();
  const [comment, setComment] = useState("");
  const [privateZone, setPrivateZone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!zone) return;
    setComment(zone.comment ?? "");
    setPrivateZone(zone.private_zone);
  }, [zone]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!zone) return;

    setLoading(true);
    try {
      const updated = await updateHostedZone(zone.id, {
        comment: comment.trim() || null,
        private_zone: privateZone,
      });
      showToast(`Hosted zone "${updated.name}" updated`, "success");
      onUpdated(updated);
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to update hosted zone"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit hosted zone"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading || !zone}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </>
      }
    >
      {zone ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Domain name" htmlFor="edit-zone-name" value={zone.name} disabled />
          <InputField
            label="Comment"
            htmlFor="edit-zone-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <CheckboxField
            label="Private hosted zone"
            htmlFor="edit-zone-private"
            checked={privateZone}
            onChange={(event) => setPrivateZone(event.target.checked)}
          />
        </form>
      ) : null}
    </Modal>
  );
}
