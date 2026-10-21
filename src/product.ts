import type { AppState, Pet, PetRecord, Post } from './types';
import { dayDiff, KIND, recsOf, reminders, today, ymd } from './utils';

/** A deliberately narrow local parser, not a model or medical assessment. */
export function parseWeight(text: string, now = today()): { date: string; value: string } | null {
  const match = text.trim().match(/^(今天|昨天|\d{4}-\d{2}-\d{2})?\s*(?:体重|称重)\s*(\d+(?:\.\d{1,2})?)\s*(kg|公斤|千克|斤)$/i);
  if (!match) return null;
  const n = Number(match[2]) / (match[3] === '斤' ? 2 : 1);
  if (!Number.isFinite(n) || n <= 0 || n > 200 || Math.abs(n * 100 - Math.round(n * 100)) > 0.000001) return null;
  const d = new Date(`${now}T12:00:00`);
  if (match[1] === '昨天') d.setDate(d.getDate() - 1);
  const date = match[1]?.includes('-') ? match[1] : ymd(d.getFullYear(), d.getMonth(), d.getDate());
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(+parsed) || ymd(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()) !== date || date > now) return null;
  return { date, value: String(n) };
}

export function careSummary(s: AppState, pet: Pet) {
  const all = recsOf(s, pet.id);
  const week = all.filter(r => dayDiff(today(), r.date) >= 0 && dayDiff(today(), r.date) < 7);
  const weights = all.filter(r => r.kind === 'weight' && Number.isFinite(r.value));
  const delta = weights.length > 1 ? Number(((weights[0].value as number) - (weights[1].value as number)).toFixed(2)) : null;
  const due = reminders(s, pet.id).filter(x => x.left <= 14);
  return { all, week, weights, delta, due };
}

export function healthText(s: AppState, pet: Pet) {
  const { all, due } = careSummary(s, pet);
  const row = (r: PetRecord) => `${r.date} | ${KIND[r.kind].n} | ${r.kind === 'weight' ? `${r.value}kg` : r.name || ''}${r.next ? ` | 下次 ${r.next}` : ''}${r.note ? ` | ${r.note}` : ''}`;
  return [`${pet.name} · 照护档案`, `导出日期：${today()}`, `种类：${pet.type} / ${pet.breed || '未填品种'}；生日：${pet.birthday || '未填'}`,
    '资料来自本机录入，初始档案可能含演示记录；未经过医院核验，不作为诊断或用药依据。',
    '\n未来14天与逾期提醒（按用户填写日期整理）', ...due.map(x => `${x.r.name}：${x.r.next}（${x.left < 0 ? `逾期${-x.left}天` : `${x.left}天后`}）`),
    '\n全部记录', ...(all.length ? all.map(row) : ['暂无记录'])].join('\n');
}

export function downloadText(name: string, text: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const districtName = (s?: string) => s?.trim().replace(/[区县]$/, '') || '';
const normalized = (s?: string) => s?.trim().replace(/市$/, '') || '';
export function nearbyPosts(posts: Post[], city: string, district: string, petType: string) {
  if (!city.trim()) return [];
  return posts.filter(p => normalized(p.city) === normalized(city)
    && (!district.trim() || districtName(p.district) === districtName(district))
    && (petType === '全部' || p.petType === petType));
}

/** Three calendar months ending in the selected month; Monday-first columns. */
export function healthActivity(s: AppState, pid: string, year: number, month: number, asOf = today()) {
  const from = new Date(year, month - 2, 1, 12);
  const to = new Date(year, month + 1, 0, 12);
  const format = (d: Date) => ymd(d.getFullYear(), d.getMonth(), d.getDate());
  const start = format(from), end = format(to);
  const counts: Record<string, number> = {};
  s.records.filter(r => r.petId === pid && (r.kind === 'vaccine' || r.kind === 'deworm') && r.date >= start && r.date <= end && r.date <= asOf)
    .forEach(r => { counts[r.date] = (counts[r.date] || 0) + 1; });
  const cells: (string | null)[] = Array((from.getDay() + 6) % 7).fill(null);
  const cursor = new Date(from);
  while (cursor <= to) { cells.push(format(cursor)); cursor.setDate(cursor.getDate() + 1); }
  while (cells.length % 7) cells.push(null);
  const months = [0, 1, 2].map(i => { const d = new Date(year, month - 2 + i, 1); return { year: d.getFullYear(), month: d.getMonth() + 1 }; });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { start, end, cells, counts, months, total };
}
