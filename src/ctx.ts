import { createContext, useContext } from 'react';
import type { AppState, Kind, Pet } from './types';

export interface Api {
  s: AppState;
  pet: Pet;
  patch: (p: Partial<AppState>) => void;
  openRecord: (kind: Kind, date?: string) => void;
  openPet: () => void;
  del: (id: number) => void;
  soon: (name: string) => void;
  openPick: (date: string) => void;
  openPost: () => void;
  openDetail: (id: number) => void;
  like: (id: number) => void;
}

export const AppCtx = createContext<Api>(null as unknown as Api);
export const useApp = () => useContext(AppCtx);
