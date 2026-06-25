"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LoadingState } from "@/components/ui/LoadingState";
import { Badge, PageHeader, Panel } from "@/components/ui/PageShell";
import { getErrorMessage } from "@/lib/api-client";
import type { HostedZone } from "@/lib/types";
import { listHostedZones } from "@/services/hosted-zones.service";

export default function DashboardPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [totalZones, setTotalZones] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await listHostedZones({ skip: 0, limit: 5 });
        setZones(response.items);
        setTotalZones(response.total);
        setTotalRecords(
          response.items.reduce((sum, zone) => sum + zone.record_count, 0),
        );
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load dashboard data"));
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your Route 53 hosted zones and DNS records."
      />

      {loading ? <LoadingState label="Loading dashboard..." /> : null}

      {!loading && error ? (
        <Panel className="p-6">
          <p className="text-sm text-red-600">{error}</p>
        </Panel>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Panel className="p-5">
              <p className="text-sm text-aws-text-secondary">Hosted zones</p>
              <p className="mt-2 text-3xl font-semibold text-aws-text">{totalZones}</p>
            </Panel>
            <Panel className="p-5">
              <p className="text-sm text-aws-text-secondary">Records in recent zones</p>
              <p className="mt-2 text-3xl font-semibold text-aws-text">{totalRecords}</p>
            </Panel>
            <Panel className="p-5">
              <p className="text-sm text-aws-text-secondary">Quick action</p>
              <Link
                href="/hosted-zones"
                className="mt-3 inline-flex text-sm font-medium text-aws-link hover:underline"
              >
                Manage hosted zones
              </Link>
            </Panel>
          </div>

          <Panel>
            <div className="border-b border-aws-border px-5 py-4">
              <h2 className="text-lg font-normal text-aws-text">Recent hosted zones</h2>
            </div>
            {zones.length === 0 ? (
              <div className="px-5 py-10 text-sm text-aws-text-secondary">
                No hosted zones yet.{" "}
                <Link href="/hosted-zones" className="text-aws-link hover:underline">
                  Create your first hosted zone
                </Link>
                .
              </div>
            ) : (
              <ul className="divide-y divide-aws-border">
                {zones.map((zone) => (
                  <li key={zone.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Link
                        href={`/hosted-zones/${zone.id}`}
                        className="font-medium text-aws-link hover:underline"
                      >
                        {zone.name}
                      </Link>
                      <p className="text-sm text-aws-text-secondary">
                        {zone.comment || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={zone.private_zone ? "warning" : "success"}>
                        {zone.private_zone ? "Private" : "Public"}
                      </Badge>
                      <span className="text-sm text-aws-text-secondary">
                        {zone.record_count} records
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      ) : null}
    </div>
  );
}
