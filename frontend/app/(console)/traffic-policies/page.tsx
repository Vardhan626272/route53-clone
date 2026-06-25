import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/ui/PageShell";

export default function TrafficPoliciesPage() {
  return (
    <div>
      <PageHeader
        title="Traffic policies"
        description="Route traffic based on advanced policy rules."
      />
      <ComingSoon />
    </div>
  );
}
