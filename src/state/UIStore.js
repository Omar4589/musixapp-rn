import { create } from 'zustand';

export const useUI = create(set => ({
  // 'system' | 'light' | 'dark'
  theme: 'system',
  setTheme: theme => set({ theme }),
}));
