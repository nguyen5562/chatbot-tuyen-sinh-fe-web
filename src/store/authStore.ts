import { create } from "zustand";

interface AuthState {
  loggedIn: boolean;
  user: string | null;
  userId: string | null;
  role: string | null;
  token: string | null;
  login: (fullname: any, role: any, token: any, userId: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedIn: false,
  user: null,
  userId: null,
  role: null,
  token: null,
  
  login: (fullname: any, role: any, token: any, userId: any) => {
    set({ 
      loggedIn: true, 
      user: fullname, 
      userId: userId,
      role: role,
      token: token
    });
  },
  
  logout: () => {
    set({ 
      loggedIn: false, 
      user: null, 
      userId: null,
      role: null,
      token: null
    });
  }
}));
