import { create } from 'zustand';
import {
  createApiary as createApiaryService,
  deleteApiary as deleteApiaryService,
  getApiaries,
  updateApiary as updateApiaryService,
} from '../services/apiaryService';
import { messageForError } from '../utils/errorMessages';
import type { Apiary, ApiaryInput } from '../types/Apiary';

interface ApiaryState {
  apiaries: Apiary[];
  // true after the first load finished, so screens can tell "still loading" from "none yet".
  hasLoaded: boolean;
  isLoading: boolean;
  error: string | undefined;
  loadApiaries: () => Promise<void>;
  createApiary: (input: ApiaryInput) => Promise<Apiary>;
  updateApiary: (id: string, input: ApiaryInput) => Promise<Apiary>;
  deleteApiary: (id: string) => Promise<void>;
  reset: () => void;
}

const byName = (a: Apiary, b: Apiary): number => a.name.localeCompare(b.name);

const initialState = {
  apiaries: [],
  hasLoaded: false,
  isLoading: false,
  error: undefined,
};

export const useApiaryStore = create<ApiaryState>((set) => ({
  ...initialState,
  loadApiaries: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const apiaries = await getApiaries();
      set({ apiaries, hasLoaded: true, isLoading: false });
    } catch (error) {
      set({ error: messageForError(error), hasLoaded: true, isLoading: false });
    }
  },
  createApiary: async (input) => {
    const apiary = await createApiaryService(input);
    set((state) => ({ apiaries: [...state.apiaries, apiary].sort(byName) }));
    return apiary;
  },
  updateApiary: async (id, input) => {
    const updated = await updateApiaryService(id, input);
    set((state) => ({
      apiaries: state.apiaries.map((apiary) => (apiary.id === id ? updated : apiary)).sort(byName),
    }));
    return updated;
  },
  deleteApiary: async (id) => {
    await deleteApiaryService(id);
    set((state) => ({ apiaries: state.apiaries.filter((apiary) => apiary.id !== id) }));
  },
  // Called on logout so the next user never sees someone else's data.
  reset: () => set(initialState),
}));
