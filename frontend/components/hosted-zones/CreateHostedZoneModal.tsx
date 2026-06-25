"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import type { HostedZone } from "@/lib/types";
import { createHostedZone } from "@/services/hosted-zones.service";

interface CreateHostedZoneModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (zone: HostedZone) => void;
}

export function CreateHostedZoneModal({
  open,
  onClose,
  onCreated,
}: CreateHostedZoneModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [privateZone, setPrivateZone] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setComment("");
    setPrivateZone(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const zone = await createHostedZone({
        name: name.trim(),
        comment: comment.trim() || null,
        private_zone: privateZone,
      });
      showToast(`Hosted zone "${zone.name}" created`, "success");
      onCreated(zone);
      reset();
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to create hosted zone"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Create hosted zone"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create hosted zone"}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          label="Domain name"
          htmlFor="zone-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="example.com"
          hint="Enter the domain name for the hosted zone."
          required
        />
        <InputField
          label="Comment"
          htmlFor="zone-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Optional description"
        />
        <label className="flex items-start gap-2 text-sm text-aws-text">
          <input
            type="checkbox"
            checked={privateZone}
            onChange={(event) => setPrivateZone(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-aws-border text-aws-link focus:ring-aws-link"
          />
          <span>Private hosted zone</span>
        </label>
      </form>
    </Modal>
  );
}
