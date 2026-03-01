"use client";

import { useEffect, useState } from "react";
import { getRoles, createRole, deleteRole, addPermission, removePermission, RoleResponse, CreateRoleRequest } from "@/lib/api/roles";
import { getPermissions, PermissionResponse } from "@/lib/api/permissions";

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateRoleRequest>({
    name: "",
    type: "BASE",
  });

  useEffect(() => {
    Promise.all([getRoles(), getPermissions()]).then(([r, p]) => {
      setRoles(r);
      setPermissions(p);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const newRole = await createRole({
        ...form,
        name: form.name.toUpperCase(),
      });
      setRoles((prev) => [newRole, ...prev]);
      setShowCreateModal(false);
      setForm({ name: "", type: "BASE" });
    } catch {
      setError("Failed to create role.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    await deleteRole(publicId);
    setRoles((prev) => prev.filter((r) => r.publicId !== publicId));
    if (selectedRole?.publicId === publicId) setSelectedRole(null);
  };

  const handleAddPermission = async (permissionPublicId: string) => {
    if (!selectedRole) return;
    const updated = await addPermission(selectedRole.publicId, permissionPublicId);
    setRoles((prev) => prev.map((r) => (r.publicId === updated.publicId ? updated : r)));
    setSelectedRole(updated);
  };

  const handleRemovePermission = async (permissionPublicId: string) => {
    if (!selectedRole) return;
    const updated = await removePermission(selectedRole.publicId, permissionPublicId);
    setRoles((prev) => prev.map((r) => (r.publicId === updated.publicId ? updated : r)));
    setSelectedRole(updated);
  };

  const assignedIds = selectedRole?.permissions.map((p) => p.publicId) || [];
  const availablePermissions = permissions.filter((p) => !assignedIds.includes(p.publicId));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
          <p className="text-gray-500 text-sm mt-1">{roles.length} roles found</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
        >
          + New Role
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="flex gap-6">

          {/* Lista de roles */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Type</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Company</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Permissions</th>
                    <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr
                      key={role.publicId}
                      onClick={() => setSelectedRole(role)}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${
                        selectedRole?.publicId === role.publicId ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">{role.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          role.type === "BASE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {role.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{role.companyName || "—"}</td>
                      <td className="px-6 py-4 text-gray-500">{role.permissions.length}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(role.publicId); }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Painel de permissões */}
          {selectedRole && (
            <div className="w-80 bg-white rounded-xl border border-gray-200 p-5 h-fit">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{selectedRole.name}</h3>
              <p className="text-xs text-gray-400 mb-4">Manage permissions</p>

              {/* Permissões atribuídas */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Assigned</p>
                {selectedRole.permissions.length === 0 ? (
                  <p className="text-xs text-gray-400">No permissions assigned.</p>
                ) : (
                  <div className="space-y-1">
                    {selectedRole.permissions.map((p) => (
                      <div key={p.publicId} className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-700">{p.name}</span>
                        <button
                          onClick={() => handleRemovePermission(p.publicId)}
                          className="text-xs text-red-500 hover:text-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Permissões disponíveis */}
              {availablePermissions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Available</p>
                  <div className="space-y-1">
                    {availablePermissions.map((p) => (
                      <div key={p.publicId} className="flex items-center justify-between py-1.5 px-3 border border-gray-200 rounded-lg">
                        <span className="text-xs text-gray-700">{p.name}</span>
                        <button
                          onClick={() => handleAddPermission(p.publicId)}
                          className="text-xs text-green-600 hover:text-green-800 transition"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal criar role */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Role</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="MANAGER"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as "BASE" | "CUSTOM" }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="BASE">BASE</option>
                  <option value="CUSTOM">CUSTOM</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 justify-end">
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
  );
}