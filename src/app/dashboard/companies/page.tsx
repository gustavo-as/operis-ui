"use client";

import { useEffect, useState } from "react";
import { getCompanies, createCompany, updateCompanyStatus, CompanyResponse, CreateCompanyRequest } from "@/lib/api/companies";
import PermissionGuard from "@/components/PermissionGuard";
import { PERMISSIONS } from "@/lib/auth/permissions";


const ITEMS_PER_PAGE = 10;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateCompanyRequest>({
    name: "",
    registrationNumber: "",
    vatNumber: "",
    legalForm: "",
    purpose: "",
    street: "",
    streetNumber: "",
    postalCode: "",
    municipality: "",
    country: "",
  });

  const totalPages = Math.ceil(companies.length / ITEMS_PER_PAGE);
  const paginated = companies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    getCompanies().then((data) => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const newCompany = await createCompany(form);
      setCompanies((prev) => [newCompany, ...prev]);
      setShowCreateModal(false);
      setForm({
        name: "", registrationNumber: "", vatNumber: "", legalForm: "",
        purpose: "", street: "", streetNumber: "", postalCode: "", municipality: "", country: "",
      });
    } catch {
      setError("Failed to create company.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent, publicId: string, active: boolean) => {
    e.stopPropagation();
    const updated = await updateCompanyStatus(publicId, !active);
    setCompanies((prev) => prev.map((c) => (c.publicId === publicId ? updated : c)));
  };

  return (
     <PermissionGuard permission={PERMISSIONS.VIEW_USERS}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
            <p className="text-gray-500 text-sm mt-1">{companies.length} companies found</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
          >
            + New Company
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Registration</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Country</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((company) => (
                    <tr key={company.publicId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-medium">{company.name}</td>
                      <td className="px-6 py-4 text-gray-500">{company.registrationNumber}</td>
                      <td className="px-6 py-4 text-gray-500">{company.country || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          company.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {company.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => handleToggleStatus(e, company.publicId, company.active)}
                          className={`text-xs font-medium px-3 py-1 rounded-lg transition ${
                            company.active
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {company.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal criar empresa */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">New Company</h2>
              <form onSubmit={handleCreate} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Operis BV" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                    <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="BE0123456789" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                    <input name="vatNumber" value={form.vatNumber} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="BE0123456789" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Form</label>
                    <input name="legalForm" value={form.legalForm} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="BV" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input name="country" value={form.country} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="BE" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <input name="purpose" value={form.purpose} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Business activity" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input name="street" value={form.street} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Rue de la Loi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                    <input name="streetNumber" value={form.streetNumber} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="1000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                    <input name="municipality" value={form.municipality} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Brussels" />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}