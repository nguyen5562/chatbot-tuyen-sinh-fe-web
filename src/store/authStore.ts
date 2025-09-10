import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  loggedIn: boolean;
  user: string | null;
  userId: string | null;
  role: string | null;
  token: string | null;
  login: (fullname: any, role: any, token: any, userId: any) => void;
  logout: () => void;
  updateUser: (fullname: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      },
      
      updateUser: (fullname: string) => {
        set({ user: fullname });
      }
    }),
    {
      name: 'auth-storage', // tên key trong localStorage
      partialize: (state) => ({
        // chỉ lưu những field cần thiết, không lưu functions
        loggedIn: state.loggedIn,
        user: state.user,
        userId: state.userId,
        role: state.role,
        token: state.token
      })
    }
  )
);
