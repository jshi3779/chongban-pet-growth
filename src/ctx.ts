import { createContext, useContext } from 'react';
import type { AppState, Kind, Pet, Tab } from './types';

export interface Api {
  s: AppState;
  pet: Pet;
  go: (tab: Tab) => void;
  patch: (p: Partial<AppState>) => void;
  openRecord: (kind: Kind, date?: string, value?: string) => void;
  openPet: () => void;
  del: (id: number) => void;
  openPick: (date: string) => void;
  openPost: (draft?: { title: string; body: string }) => void;
  openDetail: (id: number) => void;
  like: (id: number) => void;
}

export const AppCtx = createContext<Api>(null as unknown as Api);
export const useApp = () => useContext(AppCtx);
