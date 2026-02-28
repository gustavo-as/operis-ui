import api from "./client";
import { AuthResponse, LoginRequest, SwitchCompanyRequest, UserCompanyResponse } from "@/types/auth";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/v1/auth/login", data);
  return response.data;
};

export const getUserCompanies = async (): Promise<UserCompanyResponse[]> => {
  const response = await api.get<UserCompanyResponse[]>("/api/v1/auth/companies");
  return response.data;
};

export const switchCompany = async (data: SwitchCompanyRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/v1/auth/switch-company", data);
  return response.data;
};

export const refresh = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/v1/auth/refresh", {
    refreshToken,
  });
  return response.data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await api.post("/api/v1/auth/logout", { refreshToken });
};