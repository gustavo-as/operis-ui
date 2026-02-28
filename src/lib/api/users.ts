import api from "./client";
import {
  UserResponse,
  CreateUserRequest,
  UpdateUserStatusRequest,
  UserCompanyResponse,
} from "@/types/auth";

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await api.get("/api/v1/users");
  return response.data as UserResponse[];
};

export const createUser = async (data: CreateUserRequest): Promise<UserResponse> => {
  const response = await api.post("/api/v1/users", data);
  return response.data as UserResponse;
};

export const updateUserStatus = async (
  publicId: string,
  data: UpdateUserStatusRequest
): Promise<UserResponse> => {
  const response = await api.patch(`/api/v1/users/${publicId}/status`, data);
  return response.data as UserResponse;
};

export const getUserCompanies = async (publicId: string): Promise<UserCompanyResponse[]> => {
  const response = await api.get(`/api/v1/users/${publicId}/companies`);
  return response.data as UserCompanyResponse[];
};

export const updateUser = async (
  publicId: string,
  data: CreateUserRequest
): Promise<UserResponse> => {
  const response = await api.put(`/api/v1/users/${publicId}`, data);
  return response.data as UserResponse;
};

export const assignCompany = async (
  userPublicId: string,
  data: { companyPublicId: string; rolePublicId: string }
): Promise<UserCompanyResponse> => {
  const response = await api.post(`/api/v1/users/${userPublicId}/companies`, data);
  return response.data as UserCompanyResponse;
};

export const removeCompany = async (
  userPublicId: string,
  companyPublicId: string
): Promise<void> => {
  await api.delete(`/api/v1/users/${userPublicId}/companies/${companyPublicId}`);
};