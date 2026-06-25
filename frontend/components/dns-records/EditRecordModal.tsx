"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { InputField, SelectField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import { RECORD_TYPES, type DNSRecord } from "@/lib/types";
import { updateDnsRecord } from "@/services/dns-records.service";

interface EditRecordModalProps {
  open: boolean;
  zoneId: string;
  record: DNSRecord | null;
  onClose: () => void;
  onUpdated: (record: DNSRecord) => void;
}

export function EditRecordModal({
  open,
  zoneId,
  record,
  onClose,
  onUpdated,
}: EditRecordModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [recordType, setRecordType] = useState<(typeof RECORD_TYPES)[number]>("A");
  const [ttl, setTtl] = useState("300");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!record) return;
    setName(record.name);
    setRecordType(record.record_type);
    setTtl(String(record.ttl));
    setValue(record.value);
  }, [record]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!record) return;

    setLoading(true);
    try {
      const updated = await updateDnsRecord(zoneId, record.id, {
        name: name.trim(),
        record_type: recordType,
        ttl: Number(ttl),
        value: value.trim(),
      });
      showToast(`Record "${updated.name}" updated`, "success");
      onUpdated(updated);
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to update record"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit record"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading || !record}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </>
      }
    >
      {record ? (
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <InputField
            label="Record name"
            htmlFor="edit-record-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="md:col-span-2"
            required
          />
          <SelectField
            label="Record type"
            htmlFor="edit-record-type"
            value={recordType}
            onChange={(event) =>
              setRecordType(event.target.value as (typeof RECORD_TYPES)[number])
            }
          >
            {RECORD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectField>
          <InputField
            label="TTL (seconds)"
            htmlFor="edit-record-ttl"
            type="number"
            min={1}
            value={ttl}
            onChange={(event) => setTtl(event.target.value)}
            required
          />
          <InputField
            label="Value"
            htmlFor="edit-record-value"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="md:col-span-2"
            required
          />
        </form>
      ) : null}
    </Modal>
  );
}
