"use client";

import { useAuthStore } from "@/lib/auth/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CompanySwitcher from "@/components/CompanySwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, email } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/dashboard/users" },
  { label: "Companies", href: "/dashboard/companies" },
];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">Operis</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{email}</span>
          <CompanySwitcher />
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-56 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm transition ${
                  pathname === item.href
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}