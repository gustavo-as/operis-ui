import api from "./client";

export interface PermissionResponse {
  publicId: string;
  name: string;
  description: string;
}

export const getPermissions = async (): Promise<PermissionResponse[]> => {
  const response = await api.get("/api/v1/permissions");
  return response.data as PermissionResponse[];
};