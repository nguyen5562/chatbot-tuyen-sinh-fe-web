import { create } from "zustand";
import {
  isLoggedIn as checkIsLoggedIn,
  login as authLogin,
  logout as authLogout,
} from "../utils/localStorage";

interface AuthState {
  loggedIn: boolean;
  user: string | null;
  login: (fullname: any, role: any, token: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedIn: checkIsLoggedIn(),
  user: localStorage.getItem("user"),
  login: (fullname: any, role: any, token: any) => {
    authLogin(fullname, role, token);
    set({ loggedIn: true, user: fullname });
  },
  logout: () => {
    authLogout();
    set({ loggedIn: false, user: null });
  },
}));
