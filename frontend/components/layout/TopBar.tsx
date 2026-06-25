"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { clearAuth, getUser } from "@/lib/auth";
import { logout } from "@/services/auth.service";

export function TopBar() {
  const router = useRouter();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Clear local session even if the backend call fails.
    } finally {
      clearAuth();
      showToast("Signed out successfully", "success");
      router.push("/login");
    }
  };

  return (
    <header className="border-b border-[#1a242f] bg-aws-header text-white">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-aws-orange text-sm font-bold text-aws-header">
              53
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">Route 53</p>
              <p className="hidden text-xs text-[#aab7b8] sm:block">AWS Console Clone</p>
            </div>
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded border border-[#3b4752] px-3 py-2 text-sm hover:bg-[#2a3948]"
          >
            <span className="hidden sm:inline">{user?.username ?? "Account"}</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#545b64] text-xs font-semibold">
              {(user?.username ?? "A").slice(0, 1).toUpperCase()}
            </span>
          </button>

          {menuOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-56 rounded border border-aws-border bg-white py-2 text-aws-text shadow-xl">
              <div className="border-b border-aws-border px-4 py-3">
                <p className="text-sm font-medium">{user?.username ?? "User"}</p>
                <p className="text-xs text-aws-muted">{user?.email ?? "admin@example.com"}</p>
              </div>
              <div className="px-2 py-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
