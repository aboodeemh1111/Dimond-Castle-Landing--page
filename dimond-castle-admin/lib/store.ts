import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setToken: (token: string) => set({ accessToken: token }),
  clearToken: () => set({ accessToken: null }),
}));
