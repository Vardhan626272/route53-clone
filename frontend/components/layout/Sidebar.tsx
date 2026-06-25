"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  enabled: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", enabled: true },
  { label: "Hosted Zones", href: "/hosted-zones", enabled: true },
  { label: "Traffic Policies", href: "/traffic-policies", enabled: false },
  { label: "Health Checks", href: "/health-checks", enabled: false },
  { label: "Resolver", href: "/resolver", enabled: false },
  { label: "Profiles", href: "/profiles", enabled: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-[#1a242f] bg-aws-sidebar text-white lg:w-64 lg:shrink-0">
      <div className="border-b border-[#1a242f] px-4 py-4 lg:hidden">
        <p className="text-xs uppercase tracking-[0.2em] text-[#aab7b8]">Navigation</p>
      </div>
      <nav className="px-2 py-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[#33475b] font-medium text-white"
                      : "text-[#d5dbdb] hover:bg-[#2a3948] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
