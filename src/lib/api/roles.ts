import api from "./client";

export interface PermissionResponse {
  publicId: string;
  name: string;
  description: string;
}

export interface RoleResponse {
  publicId: string;
  name: string;
  type: string;
  companyPublicId: string | null;
  companyName: string | null;
  permissions: PermissionResponse[];
}

export interface CreateRoleRequest {
  name: string;
  type: "BASE" | "CUSTOM";
  companyPublicId?: string;
}

export const getRoles = async (): Promise<RoleResponse[]> => {
  const response = await api.get("/api/v1/roles");
  return response.data as RoleResponse[];
};

export const createRole = async (data: CreateRoleRequest): Promise<RoleResponse> => {
  const response = await api.post("/api/v1/roles", data);
  return response.data as RoleResponse;
};

export const deleteRole = async (publicId: string): Promise<void> => {
  await api.delete(`/api/v1/roles/${publicId}`);
};

export const addPermission = async (
  rolePublicId: string,
  permissionPublicId: string
): Promise<RoleResponse> => {
  const response = await api.post(`/api/v1/roles/${rolePublicId}/permissions`, {
    permissionPublicId,
  });
  return response.data as RoleResponse;
};

export const removePermission = async (
  rolePublicId: string,
  permissionPublicId: string
): Promise<RoleResponse> => {
  const response = await api.delete(`/api/v1/roles/${rolePublicId}/permissions`, {
    data: { permissionPublicId },
  });
  return response.data as RoleResponse;
};