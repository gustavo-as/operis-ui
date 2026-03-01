"use client";

import { usePermission } from "@/lib/auth/usePermission";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  permission: string;
  children: React.ReactNode;
}

export default function PermissionGuard({ permission, children }: Props) {
  const { has } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!has(permission)) {
      router.push("/dashboard");
    }
  }, [permission, has, router]);

  if (!has(permission)) return null;

  return <>{children}</>;
}