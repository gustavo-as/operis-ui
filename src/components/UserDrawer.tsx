"use client";

import { useEffect, useState } from "react";
import { UserResponse, UserCompanyResponse } from "@/types/auth";
import {
  getUserCompanies,
  updateUser,
  removeCompany,
} from "@/lib/api/users";
import { X } from "lucide-react";

interface Props {
  user: UserResponse | null;
  onClose: () => void;
  onUpdated: (user: UserResponse) => void;
}

type Tab = "edit" | "companies";

export default function UserDrawer({ user, onClose, onUpdated }: Props) {
  const [tab, setTab] = useState<Tab>("edit");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState<UserCompanyResponse[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassword("");
      setError("");
      setTab("edit");
    }
  }, [user]);

  useEffect(() => {
    if (user && tab === "companies") {
      setLoadingCompanies(true);
      getUserCompanies(user.publicId)
        .then(setCompanies)
        .finally(() => setLoadingCompanies(false));
    }
  }, [user, tab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateUser(user.publicId, { email, password });
      onUpdated(updated);
      onClose();
    } catch {
      setError("Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCompany = async (companyPublicId: string) => {
    if (!user) return;
    await removeCompany(user.publicId, companyPublicId);
    setCompanies((prev) => prev.filter((c) => c.companyPublicId !== companyPublicId));
  };

  if (!user) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{user.email}</h2>
            <p className="text-xs text-gray-400 mt-0.5">User details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {(["edit", "companies"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 mr-6 text-sm font-medium border-b-2 transition ${
                tab === t
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "edit" ? "Edit" : "Companies"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "edit" && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Leave blank to keep current"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {tab === "companies" && (
            <div className="space-y-3">
              {loadingCompanies ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : companies.length === 0 ? (
                <p className="text-sm text-gray-400">No companies linked.</p>
              ) : (
                companies.map((c) => (
                  <div
                    key={c.companyPublicId}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.companyName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.role}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveCompany(c.companyPublicId)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}