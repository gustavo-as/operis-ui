import api from "./client";

export interface CompanyOption {
  publicId: string;
  name: string;
}

export interface RoleOption {
  publicId: string;
  name: string;
  type: string;
}

export const getCompanies = async (): Promise<CompanyOption[]> => {
  const response = await api.get("/api/v1/companies");
  return response.data.map((c: any) => ({
    publicId: c.publicId,
    name: c.name,
  }));
};

export const getRoles = async (): Promise<RoleOption[]> => {
  const response = await api.get("/api/v1/roles");
  return response.data.map((r: any) => ({
    publicId: r.publicId,
    name: r.name,
    type: r.type,
  }));
};