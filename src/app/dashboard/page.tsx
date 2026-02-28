"use client";

import { useAuthStore } from "@/lib/auth/store";

export default function DashboardPage() {
  const { role } = useAuthStore();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Welcome back! You are logged in as <strong>{role}</strong>.
      </p>
    </div>
  );
}