import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/ui/PageShell";

export default function HealthChecksPage() {
  return (
    <div>
      <PageHeader
        title="Health checks"
        description="Monitor the health and performance of your endpoints."
      />
      <ComingSoon />
    </div>
  );
}
