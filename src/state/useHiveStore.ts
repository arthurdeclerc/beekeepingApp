import { create } from 'zustand';
import {
  createHive as createHiveService,
  getHives,
  updateHive as updateHiveService,
} from '../services/hiveService';
import { messageForError } from '../utils/errorMessages';
import type { Hive, HiveInput } from '../types/Hive';

interface HiveState {
  // Hives per apiary id; a missing key means that apiary has not been loaded yet.
  hivesByApiary: Record<string, Hive[]>;
  error: string | undefined;
  loadHives: (apiaryId: string) => Promise<void>;
  createHive: (apiaryId: string, input: HiveInput) => Promise<Hive>;
  updateHive: (apiaryId: string, hiveId: string, input: HiveInput) => Promise<Hive>;
  reset: () => void;
}

const byName = (a: Hive, b: Hive): number =>
  a.name.localeCompare(b.name, undefined, { numeric: true });

export const useHiveStore = create<HiveState>((set) => ({
  hivesByApiary: {},
  error: undefined,
  loadHives: async (apiaryId) => {
    set({ error: undefined });
    try {
      const hives = await getHives(apiaryId);
      set((state) => ({ hivesByApiary: { ...state.hivesByApiary, [apiaryId]: hives } }));
    } catch (error) {
      set({ error: messageForError(error) });
    }
  },
  createHive: async (apiaryId, input) => {
    const hive = await createHiveService(apiaryId, input);
    set((state) => ({
      hivesByApiary: {
        ...state.hivesByApiary,
        [apiaryId]: [...(state.hivesByApiary[apiaryId] ?? []), hive].sort(byName),
      },
    }));
    return hive;
  },
  updateHive: async (apiaryId, hiveId, input) => {
    const updated = await updateHiveService(hiveId, input);
    set((state) => ({
      hivesByApiary: {
        ...state.hivesByApiary,
        [apiaryId]: (state.hivesByApiary[apiaryId] ?? [])
          .map((hive) => (hive.id === hiveId ? updated : hive))
          .sort(byName),
      },
    }));
    return updated;
  },
  // Called on logout so the next user never sees someone else's data.
  reset: () => set({ hivesByApiary: {}, error: undefined }),
}));
