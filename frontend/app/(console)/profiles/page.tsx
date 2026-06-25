import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/ui/PageShell";

export default function ProfilesPage() {
  return (
    <div>
      <PageHeader
        title="Profiles"
        description="Configure Route 53 profiles for your DNS settings."
      />
      <ComingSoon />
    </div>
  );
}
