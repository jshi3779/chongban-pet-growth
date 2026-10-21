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

export interface Post {
  id: number;
  author: string;
  pet: string;
  title: string;
  body: string;
  img?: string;
  shape: 'a' | 'b' | 'c';
  likes: number;
  liked: boolean;
  /** 距离（公里），有值才会出现在「附近宠友」 */
  km?: number;
  place?: string;
  mine?: boolean;
  city?: string;
  district?: string;
  petType?: string;
}

export interface CalState { y: number; m: number; sel: string | null }

export interface AppState {
  cur: string;
  tab: Tab;
  filter: 'all' | Kind;
  comm: 'recommend' | 'nearby';
  posts: Post[];
  cal: CalState;
  pets: Pet[];
  records: PetRecord[];
  region: { city: string; district: string };
}
