export interface LoginRequest {
  email: string;
  password: string;
}

export interface SwitchCompanyRequest {
  companyPublicId: string;
  refreshToken: string;
}

export interface UserCompanyResponse {
  companyPublicId: string;
  companyName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  companyPublicId: string;
  companyName: string;
  role: string;
  permissions: string[];
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  companyPublicId: string | null;
  companyName: string | null;
  role: string | null;
  permissions: string[];
  isAuthenticated: boolean;
}

export interface UserResponse {
  publicId: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserStatusRequest {
  active: boolean;
}

export interface UserCompanyAssignRequest {
  companyPublicId: string;
  rolePublicId: string;
}