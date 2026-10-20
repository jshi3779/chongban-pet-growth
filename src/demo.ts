import type { AppState, PetRecord } from './types';
import { shift } from './utils';

export const HEALTH = ['vaccine', 'deworm'] as const;
export const isHealth = (r: PetRecord) => r.kind === 'vaccine' || r.kind === 'deworm';
export const isLife = (r: PetRecord) => r.kind === 'weight' || r.kind === 'milestone';

/** 当前宠物还没有任何记录时，用几条示例数据展示样式（不写入存档，id 为负数） */
export function withDemo(s: AppState, pid: string): { st: AppState; demo: boolean } {
  if (s.records.some(r => r.petId === pid)) return { st: s, demo: false };
  const d = (n: number) => shift(n);
  const demo: PetRecord[] = [
    { id: -1, petId: pid, kind: 'weight', date: d(0), value: 4.2, note: '早餐前称重' },
    { id: -2, petId: pid, kind: 'vaccine', date: d(0), name: '狂犬疫苗', note: '社区宠物医院', next: d(365) },
    { id: -3, petId: pid, kind: 'deworm', date: d(-1), name: '体外驱虫', note: '滴剂', next: d(5) },
    { id: -4, petId: pid, kind: 'milestone', date: d(-3), name: '第一次去公园', note: '追着蝴蝶跑了一圈' },
    { id: -5, petId: pid, kind: 'vaccine', date: d(-40), name: '猫三联（第2针）', next: d(2) },
    { id: -6, petId: pid, kind: 'weight', date: d(-30), value: 3.9 },
    { id: -7, petId: pid, kind: 'weight', date: d(-90), value: 3.1 },
    { id: -8, petId: pid, kind: 'weight', date: d(-150), value: 2.2 },
    { id: -9, petId: pid, kind: 'milestone', date: d(-150), name: '到家第一天', note: '躲在沙发底下不肯出来' },
  ];
  return { st: { ...s, records: [...s.records, ...demo] }, demo: true };
}
