import type { AppState, Kind, Pet, PetRecord, Post } from './types';

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

export function seedPosts(): Post[] {
  return [
    { id: 101, author: '橘子妈', pet: '小橘', title: '第一次带猫猫去体检，全程没哭！', body: '提前一周开始适应航空箱，到医院还乖乖吃了零食。记录一下体检的流程和花费，给新手铲屎官参考。', img: 'cat.jpg', shape: 'a', likes: 238, liked: false, km: 0.8, place: '徐汇' },
    { id: 102, author: 'Coco 的爸爸', pet: 'Coco', title: '周末遛狗路线分享', body: '滨江大道从日晖桥走到龙华，沿途有草坪，出行前确认当地宠物通行规定，全程使用牵引绳。', img: 'dog.jpg', shape: 'b', likes: 156, liked: true, km: 1.5, place: '徐汇' },
    { id: 103, author: '布丁家', pet: '布丁', title: '换粮过渡期别心急', body: '7 天过渡法：每天多换 1/7，拉稀就退回上一步。我家布丁这次一次成功。', shape: 'c', likes: 89, liked: false, km: 2.3, place: '长宁' },
    { id: 104, author: '猫奴小王', pet: '大福', title: '午后的小猫咪', body: '晒太阳的时候最乖。', img: 'cat-memory.jpg', shape: 'c', likes: 342, liked: false },
    { id: 105, author: '年糕的铲屎官', pet: '年糕', title: '新手养猫避坑指南', body: '1. 猫砂盆数量 = 猫数 + 1\n2. 水碗要远离食盆\n3. 疫苗和驱虫按时间表走，在「日历」里打卡就不会忘。', shape: 'a', likes: 521, liked: false },
    { id: 106, author: 'Momo', pet: '摩卡', title: '狗狗社交小课堂', body: '见到陌生狗先侧身，不要正面对视，尾巴放松才算友好。', img: 'dog.jpg', shape: 'a', likes: 77, liked: false, km: 3.1, place: '静安' },
  ].map(p => ({ ...p, petType: [101, 104, 105].includes(p.id) ? '猫' : '狗', km: undefined, ...(p.place ? { city: '上海', district: p.place } : {}) })) as Post[];
}

export function seed(): AppState {
  const d = (n: number) => shift(-n), f = (n: number) => shift(n);
  return {
    cur: 'p1', tab: 'home', filter: 'all', comm: 'recommend', posts: seedPosts(), cal: calInit(), region: { city: '', district: '' },
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
      const posts: Post[] = Array.isArray(s.posts) ? s.posts : base.posts;
      return { ...base, ...s, region: { city: typeof s.region?.city === 'string' ? s.region.city : '', district: typeof s.region?.district === 'string' ? s.region.district : '' },
        cal: s.cal && s.cal.y ? s.cal : base.cal, comm: s.comm || 'recommend', posts: posts.map(p => {
          const demo = !p.mine && p.id >= 101 && p.id <= 106;
          return { ...p, ...(demo ? { petType: [101, 104, 105].includes(p.id) ? '猫' : '狗', ...(p.place ? { city: '上海', district: p.place } : {}) } : {}), km: undefined };
        }),
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
