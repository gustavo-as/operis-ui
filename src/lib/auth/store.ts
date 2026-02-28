import { create } from "zustand";
import { AuthState } from "@/types/auth";

interface AuthStore extends AuthState {
  setAuth: (auth: Omit<AuthState, "isAuthenticated">) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  email: null,
  companyPublicId: null,
  companyName: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setAuth: (auth) => {
    // Persiste o token no localStorage
    localStorage.setItem("accessToken", auth.accessToken || "");
    localStorage.setItem("refreshToken", auth.refreshToken || "");

    set({
      ...auth,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set(initialState);
  },
}));