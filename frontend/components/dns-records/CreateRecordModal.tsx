"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { InputField, SelectField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import { RECORD_TYPES, type DNSRecord } from "@/lib/types";
import { createDnsRecord } from "@/services/dns-records.service";

interface CreateRecordModalProps {
  open: boolean;
  zoneId: string;
  onClose: () => void;
  onCreated: (record: DNSRecord) => void;
}

export function CreateRecordModal({
  open,
  zoneId,
  onClose,
  onCreated,
}: CreateRecordModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [recordType, setRecordType] = useState<(typeof RECORD_TYPES)[number]>("A");
  const [ttl, setTtl] = useState("300");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setRecordType("A");
    setTtl("300");
    setValue("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const record = await createDnsRecord(zoneId, {
        name: name.trim(),
        record_type: recordType,
        ttl: Number(ttl),
        value: value.trim(),
      });
      showToast(`Record "${record.name}" created`, "success");
      onCreated(record);
      reset();
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to create record"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Create record"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !value.trim()}
          >
            {loading ? "Creating..." : "Create record"}
          </Button>
        </>
      }
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <InputField
          label="Record name"
          htmlFor="record-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="www.example.com"
          className="md:col-span-2"
          required
        />
        <SelectField
          label="Record type"
          htmlFor="record-type"
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
          htmlFor="record-ttl"
          type="number"
          min={1}
          value={ttl}
          onChange={(event) => setTtl(event.target.value)}
          required
        />
        <InputField
          label="Value"
          htmlFor="record-value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="1.2.3.4"
          className="md:col-span-2"
          required
        />
      </form>
    </Modal>
  );
}
