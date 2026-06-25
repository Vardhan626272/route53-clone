"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoadingState } from "@/components/ui/LoadingState";
import { isAuthenticated } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-aws-bg">
        <LoadingState label="Checking session..." />
      </div>
    );
  }

  return <>{children}</>;
}
