"use client";

import { useAuthStore } from "@/lib/auth/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CompanySwitcher from "@/components/CompanySwitcher";

export default function DashboardPage() {
  const { isAuthenticated, email, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">Operis</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{email}</span>
          <CompanySwitcher />
        </div>
      </nav>

      <main className="p-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! You are logged in as <strong>{role}</strong>.
        </p>
      </main>
    </div>
  );
}