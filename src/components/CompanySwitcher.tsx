"use client";

import { useEffect, useRef, useState } from "react";
import { getUserCompanies, switchCompany } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/auth/store";
import { UserCompanyResponse } from "@/types/auth";
import { ChevronDown } from "lucide-react";

export default function CompanySwitcher() {
  const { companyName, companyPublicId, refreshToken, setAuth } = useAuthStore();
  const [companies, setCompanies] = useState<UserCompanyResponse[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUserCompanies().then(setCompanies);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = async (publicId: string) => {
    if (publicId === companyPublicId) {
      setOpen(false);
      return;
    }

    try {
      const response = await switchCompany({
        companyPublicId: publicId,
        refreshToken: refreshToken || "",
      });

      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        email: response.email,
        companyPublicId: response.companyPublicId,
        companyName: response.companyName,
        role: response.role,
        permissions: response.permissions,
      });
    } catch {
      console.error("Failed to switch company");
    } finally {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 transition"
      >
        {companyName}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {companies.map((c) => (
            <button
              key={c.companyPublicId}
              onClick={() => handleSwitch(c.companyPublicId)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition first:rounded-t-xl last:rounded-b-xl ${
                c.companyPublicId === companyPublicId
                  ? "font-medium text-gray-900"
                  : "text-gray-600"
              }`}
            >
              <div>{c.companyName}</div>
              <div className="text-xs text-gray-400">{c.role}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}