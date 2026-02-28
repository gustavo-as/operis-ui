export interface LoginRequest {
  email: string;
  password: string;
}

export interface SwitchCompanyRequest {
  companyPublicId: string;
  refreshToken: string;
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