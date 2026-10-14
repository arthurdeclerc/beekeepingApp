import { create } from 'zustand';
import { useApiaryStore } from './useApiaryStore';
import { useHiveStore } from './useHiveStore';
import {
  login as loginService,
  logout as logoutService,
  watchSession,
} from '../services/authService';
import type { Credentials } from '../types/Auth';
import type { User } from '../types/User';

interface AuthState {
  user: User | undefined;
  isAuthenticated: boolean;
  // false until the stored session has been read, so we don't flash the login screen.
  isInitialized: boolean;
  isLoading: boolean;
  initialize: () => () => void;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  initialize: () =>
    watchSession((user) => {
      if (user === undefined) {
        useApiaryStore.getState().reset();
        useHiveStore.getState().reset();
      }
      set({ user, isAuthenticated: user !== undefined, isInitialized: true });
    }),
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const user = await loginService(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    await logoutService();
    useApiaryStore.getState().reset();
    useHiveStore.getState().reset();
    set({ user: undefined, isAuthenticated: false });
  },
}));
