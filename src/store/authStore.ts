import { create } from "zustand";
import {
  isLoggedIn as checkIsLoggedIn,
  login as authLogin,
  logout as authLogout,
} from "../utils/localStorage";

interface AuthState {
  loggedIn: boolean;
  user: string | null;
  userId: string | null;
  login: (fullname: any, role: any, token: any, userId: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedIn: checkIsLoggedIn(),
  user: localStorage.getItem("user"),
  userId: localStorage.getItem("userId"),
  login: (fullname: any, role: any, token: any, userId: any) => {
    authLogin(fullname, role, token, userId);
    set({ loggedIn: true, user: fullname, userId: userId });
  },
  logout: () => {
    authLogout();
    set({ loggedIn: false, user: null, userId: null });
  },
}));
