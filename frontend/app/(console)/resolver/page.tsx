import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/ui/PageShell";

export default function ResolverPage() {
  return (
    <div>
      <PageHeader
        title="Resolver"
        description="Manage DNS resolution between your VPC and network."
      />
      <ComingSoon />
    </div>
  );
}
