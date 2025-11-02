"use client";

import { create } from "zustand";

type User = { id: string; name: string; email: string } | null;

type AuthState = {
  accessToken: string | null;
  user: User;
  setAuth: (token: string, user: User) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clear: () => set({ accessToken: null, user: null }),
}));

