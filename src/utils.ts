import type { AppState, Kind, Pet, PetRecord } from './types';

export const KEY = 'petgrowth.v1';
export const KIND: Record<Kind, { n: string; e: string }> = {
  weight: { n: '体重', e: '⚖️' },
  vaccine: { n: '疫苗', e: '💉' },
  deworm: { n: '驱虫', e: '🐛' },
  milestone: { n: '成长瞬间', e: '🎉' },
};
export const EMOJI: Record<string, string> = { 猫: '🐱', 狗: '🐶', 兔子: '🐰', 仓鼠: '🐹', 其他: '🐾' };

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const today = () => iso(new Date());
export const shift = (n: number) => { const t = new Date(); t.setDate(t.getDate() + n); return iso(t); };
export const dayDiff = (a: string, b: string) => Math.round((+new Date(a) - +new Date(b)) / 864e5);
const pad2 = (n: number) => String(n).padStart(2, '0');
export const ymd = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`;

export function age(b: string) {
  const d = dayDiff(today(), b);
  if (d < 0) return '未出生';
  if (d < 31) return `${d}天`;
  const m = Math.floor(d / 30.4);
  return m < 12 ? `${m}个月` : `${Math.floor(m / 12)}岁${m % 12 ? `${m % 12}个月` : ''}`;
}

export function calInit() { const n = new Date(); return { y: n.getFullYear(), m: n.getMonth(), sel: today() as string | null }; }

export function seed(): AppState {
  const d = (n: number) => shift(-n), f = (n: number) => shift(n);
  return {
    cur: 'p1', tab: 'home', filter: 'all', seg: 'friends', cal: calInit(),
    pets: [{ id: 'p1', name: '年糕', type: '猫', breed: '英短蓝猫', gender: '♂', birthday: d(420) }],
    records: [
      { id: 1, petId: 'p1', kind: 'milestone', date: d(420), name: '来到这个世界', note: '出生啦' },
      { id: 2, petId: 'p1', kind: 'milestone', date: d(330), name: '到家第一天', note: '躲在沙发底下不肯出来' },
      { id: 3, petId: 'p1', kind: 'weight', date: d(300), value: 1.6 },
      { id: 4, petId: 'p1', kind: 'vaccine', date: d(280), name: '猫三联（第1针）', next: d(259) },
      { id: 5, petId: 'p1', kind: 'weight', date: d(240), value: 2.8 },
      { id: 6, petId: 'p1', kind: 'deworm', date: d(200), name: '体内驱虫', note: '大宠爱', next: d(110) },
      { id: 7, petId: 'p1', kind: 'weight', date: d(150), value: 3.9 },
      { id: 8, petId: 'p1', kind: 'vaccine', date: d(60), name: '狂犬疫苗', next: f(305) },
      { id: 9, petId: 'p1', kind: 'weight', date: d(30), value: 4.4 },
      { id: 10, petId: 'p1', kind: 'deworm', date: d(80), name: '体外驱虫', note: '福来恩', next: f(10) },
      { id: 11, petId: 'p1', kind: 'weight', date: d(3), value: 4.6 },
    ],
  };
}

export function load(): AppState {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && Array.isArray(s.pets) && s.pets.length) {
      const base = seed();
      return { ...base, ...s, cal: s.cal && s.cal.y ? s.cal : base.cal, seg: s.seg || 'friends',
        tab: ['home', 'calendar', 'timeline', 'community'].includes(s.tab) ? s.tab : 'home' };
    }
  } catch { /* ignore */ }
  return seed();
}
export function persist(s: AppState) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }

export const recsOf = (s: AppState, pid: string, k?: Kind): PetRecord[] =>
  s.records.filter(r => r.petId === pid && (!k || r.kind === k)).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

export interface Reminder { r: PetRecord; left: number }
export function reminders(s: AppState, pid: string): Reminder[] {
  return recsOf(s, pid)
    .filter(r => r.next && (r.kind === 'vaccine' || r.kind === 'deworm'))
    .filter(r => !s.records.some(x => x.petId === r.petId && x.kind === r.kind && x.name === r.name && x.date > r.date))
    .map(r => ({ r, left: dayDiff(r.next as string, today()) }))
    .sort((a, b) => a.left - b.left);
}

export function streak(s: AppState, pid: string) {
  const days = new Set(s.records.filter(r => r.petId === pid).map(r => r.date));
  let n = 0; const d = new Date();
  if (!days.has(today())) d.setDate(d.getDate() - 1);
  while (days.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export const curPet = (s: AppState): Pet => s.pets.find(p => p.id === s.cur) || s.pets[0];
