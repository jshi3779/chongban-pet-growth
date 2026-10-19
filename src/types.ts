export type Kind = 'weight' | 'vaccine' | 'deworm' | 'milestone';
export type Tab = 'home' | 'calendar' | 'timeline' | 'community';

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  gender?: string;
  birthday?: string;
}

export interface PetRecord {
  id: number;
  petId: string;
  kind: Kind;
  date: string;
  value?: number;
  name?: string;
  next?: string;
  note?: string;
}

export interface CalState { y: number; m: number; sel: string | null }

export interface AppState {
  cur: string;
  tab: Tab;
  htab: 'timeline' | 'profile';
  filter: 'all' | Kind;
  seg: 'friends' | 'share';
  cal: CalState;
  pets: Pet[];
  records: PetRecord[];
}
