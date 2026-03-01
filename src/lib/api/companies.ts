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

export interface CompanyResponse {
  publicId: string;
  name: string;
  registrationNumber: string;
  vatNumber: string;
  legalForm: string;
  purpose: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  municipality: string;
  country: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  registrationNumber: string;
  vatNumber?: string;
  legalForm?: string;
  purpose?: string;
  street?: string;
  streetNumber?: string;
  postalCode?: string;
  municipality?: string;
  country?: string;
}

export const getCompanies = async (): Promise<CompanyResponse[]> => {
  const response = await api.get("/api/v1/companies");
  return response.data as CompanyResponse[];
};
export const createCompany = async (data: CreateCompanyRequest): Promise<CompanyResponse> => {
  const response = await api.post("/api/v1/companies", data);
  return response.data as CompanyResponse;
};

export const updateCompanyStatus = async (
  publicId: string,
  active: boolean
): Promise<CompanyResponse> => {
  const response = await api.patch(`/api/v1/companies/${publicId}/status`, { active });
  return response.data as CompanyResponse;
};

export const getRoles = async (): Promise<RoleOption[]> => {
  const response = await api.get("/api/v1/roles");
  return response.data.map((r: any) => ({
    publicId: r.publicId,
    name: r.name,
    type: r.type,
  }));
};