import { useState } from 'react';
import { useApp } from '../ctx';
import { KIND, calInit, dayDiff, recsOf, reminders, shift, streak, today, ymd } from '../utils';
import type { AppState, Kind, PetRecord } from '../types';
import { PetSwitch } from './Common';

const KINDS: Kind[] = ['weight', 'vaccine', 'deworm', 'milestone'];
const WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const parse = (d: string) => new Date(`${d}T00:00:00`);
const fmt = (d: Date) => ymd(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: string, n: number) => { const t = parse(d); t.setDate(t.getDate() + n); return fmt(t); };

function monday(d: string) {
  const t = parse(d); const w = (t.getDay() + 6) % 7;
  t.setDate(t.getDate() - w); return fmt(t);
}

/** 当天记录的状态胶囊（参考图二：黑底=已完成，灰点=待办，橙=逾期） */
function Status({ r }: { r: PetRecord }) {
  if (r.next) {
    const l = dayDiff(r.next, today());
    if (l < 0) return <span className="pill pill--warn">已逾期 {-l} 天</span>;
    if (l <= 14) return <span className="pill pill--soft"><i className="pill__dot" />{l} 天后到期</span>;
  }
  return <span className="pill pill--done">已完成</span>;
}

/** 当前宠物还没有任何记录时，用几条示例日程展示样式（不写入存档） */
function withDemo(s: AppState, pid: string): { st: AppState; demo: boolean } {
  if (s.records.some(r => r.petId === pid)) return { st: s, demo: false };
  const d = (n: number) => shift(n);
  const demo: PetRecord[] = [
    { id: -1, petId: pid, kind: 'weight', date: d(0), value: 4.2, note: '早餐前称重' },
    { id: -2, petId: pid, kind: 'vaccine', date: d(0), name: '狂犬疫苗', note: '社区宠物医院', next: d(365) },
    { id: -3, petId: pid, kind: 'deworm', date: d(-1), name: '体外驱虫', note: '滴剂', next: d(5) },
    { id: -4, petId: pid, kind: 'milestone', date: d(-3), name: '第一次去公园', note: '追着蝴蝶跑了一圈' },
    { id: -5, petId: pid, kind: 'vaccine', date: d(-40), name: '猫三联（第2针）', next: d(2) },
  ];
  return { st: { ...s, records: [...s.records, ...demo] }, demo: true };
}

export function CalendarView() {
  const { s: real, pet, patch, openPick, openRecord, del } = useApp();
  const { st: s, demo } = withDemo(real, pet.id);
  const [open, setOpen] = useState(false);
  const c = s.cal || calInit();
  const sel = c.sel || today();
  const all = recsOf(s, pet.id);
  const byDay: Record<string, PetRecord[]> = {};
  const dueDay: Record<string, PetRecord> = {};
  all.forEach(r => { (byDay[r.date] = byDay[r.date] || []).push(r); if (r.next) dueDay[r.next] = r; });

  const go = (d: string) => { const t = parse(d); patch({ cal: { y: t.getFullYear(), m: t.getMonth(), sel: d } }); };
  const start = monday(sel);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const sl = byDay[sel] || [], due = dueDay[sel], future = sel > today();

  // 图一风格的打卡列表：待办（来自到期提醒）在前，已完成记录在后
  const rem = reminders(s, pet.id);
  const done = all.slice(0, 8);
  const y0 = parse(sel).getFullYear(), m0 = parse(sel).getMonth();
  const lead = (new Date(y0, m0, 1).getDay() + 6) % 7, dim = new Date(y0, m0 + 1, 0).getDate();
  const shiftMonth = (n: number) => { const t = new Date(y0, m0 + n, 1); go(fmt(t)); };
  const step = (n: number) => (open ? shiftMonth(n) : go(addDays(sel, 7 * n)));
  const monthLabel = `${parse(sel).getFullYear()}年${parse(sel).getMonth() + 1}月`;
  const nearest = rem[0];

  return (
    <>
      <PetSwitch />
      <div className="caltop">
        <h2>打卡</h2>
        <div className="monthpill">
          <button className="x" aria-label={open ? '上个月' : '上一周'} data-calnav="-1" onClick={() => step(-1)}>‹</button>
          <span>{monthLabel}</span>
          <button className={`x expand ${open ? 'open' : ''}`} aria-label={open ? '收起月历' : '展开整月'} aria-expanded={open} data-calexpand onClick={() => setOpen(v => !v)}>
            <svg viewBox="0 0 24 24" className="chev"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <button className="x" aria-label={open ? '下个月' : '下一周'} data-calnav="1" onClick={() => step(1)}>›</button>
        </div>
        <button className="roundbtn" aria-label="在所选日期添加记录" onClick={() => openPick(future ? today() : sel)}>＋</button>
      </div>

      {open ? (
        <div className="monthgrid" data-monthgrid>
          <div className="mg-week">{WEEK.map(w => <span key={w}>{w.slice(1)}</span>)}</div>
          <div className="mg-days">
            {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: dim }, (_, i) => {
              const d = ymd(y0, m0, i + 1), list = byDay[d] || [], kinds = [...new Set(list.map(r => r.kind))];
              return (
                <button key={d} className={`mg ${d === sel ? 'sel' : ''} ${d === today() ? 'today' : ''}`} data-day={d} onClick={() => { go(d); setOpen(false); }}>
                  <b>{i + 1}</b>
                  <em>{kinds.map(k => <u key={k} className={`dot ${k}`} />)}{dueDay[d] && !list.length && <u className="dot due" />}</em>
                </button>
              );
            })}
          </div>
          <div className="legend"><i className="dot weight" />体重 <i className="dot vaccine" />疫苗 <i className="dot deworm" />驱虫 <i className="dot milestone" />瞬间 <i className="dot due" />到期日</div>
        </div>
      ) : (
        <div className="weekstrip" role="tablist">
          {days.map((d, i) => {
            const n = (byDay[d] || []).length, t = parse(d);
            return (
              <button key={d} role="tab" aria-selected={d === sel} className={`wd ${d === sel ? 'sel' : ''} ${d === today() ? 'today' : ''}`} data-day={d} onClick={() => go(d)}>
                <small>{WEEK[i]}</small>
                <b>{t.getDate()}</b>
                <em>{n ? `${n} 条` : (dueDay[d] ? '到期' : '—')}</em>
              </button>
            );
          })}
        </div>
  
      )}

      <div className="stats stats--mb">
        <div className="sd-stat"><strong>{streak(s, pet.id)}</strong><span>连续打卡 天</span></div>
        <div className="sd-stat"><strong>{all.filter(r => r.date.slice(0, 7) === sel.slice(0, 7)).length}</strong><span>本月记录</span></div>
        <div className="sd-stat"><strong>{all.length}</strong><span>累计记录</span></div>
      </div>

      <section className="daylist" aria-label={`${sel} 的打卡`}>
        {sl.map(r => (
          <div key={r.id} className="slot">
            <div className="slot__t"><b>{KIND[r.kind].n}</b><small>{r.date.slice(5)}</small></div>
            <article className="slotcard">
              <div className="slotcard__top">
                <span className="slotcard__ic">{KIND[r.kind].e}</span>
                <div className="slotcard__tx"><b>{r.kind === 'weight' ? `体重 ${r.value} kg` : r.name}</b><small>{r.note || (r.next ? `下次 ${r.next}` : pet.name)}</small></div>
              </div>
              <div className="slotcard__foot"><Status r={r} />{r.id > 0 ? <button className="x" data-del={r.id} onClick={() => del(r.id)}>删除</button> : <span className="demotag">示例</span>}</div>
            </article>
          </div>
        ))}
        {due && !sl.length && (
          <div className="slot"><div className="slot__t"><b>到期</b><small>{sel.slice(5)}</small></div>
            <article className="slotcard"><div className="slotcard__top"><span className="slotcard__ic">{KIND[due.kind].e}</span><div className="slotcard__tx"><b>{due.name}</b><small>今天需要安排</small></div></div><div className="slotcard__foot"><span className="pill pill--warn">待完成</span></div></article></div>
        )}
        {!future && (
          <div className="slot"><div className="slot__t"><b>{sl.length ? '再来一条' : '今日'}</b></div>
            <div className="openslot" role="group" aria-label="添加打卡">
              <span>＋ {sl.length ? '继续打卡' : '这天还没有打卡'}</span>
              <div className="openslot__btns">{KINDS.map(k => <button key={k} data-add={k} data-date={sel} aria-label={`打卡${KIND[k].n}`} onClick={() => openRecord(k, sel)}>{KIND[k].e}</button>)}</div>
            </div>
          </div>
        )}
        {future && !sl.length && !due && <div className="empty">未来的日子，还不能打卡</div>}
      </section>

      <div className="sec">打卡记录{demo && <span className="demotag demotag--lg">示例日程</span>}</div>
      {nearest && (
        <div className="upnext" data-upnext>
          <span className="upnext__ic">{KIND[nearest.r.kind].e}</span>
          <div><small>即将到来 · {nearest.r.next}</small><b>{nearest.r.name}</b></div>
        </div>
      )}
      <div className="chk">
        {rem.map(({ r, left }) => (
          <button key={`u${r.id}`} className="chkrow" onClick={() => go(r.next as string)}>
            <div className="chkrow__d"><small>{(r.next as string).slice(5, 7)}月</small><b>{(r.next as string).slice(8)}</b></div>
            <span className={`chkrow__thumb k-${r.kind}`}>{KIND[r.kind].e}</span>
            <div className="chkrow__tx"><b>{r.name}</b><small>{left < 0 ? `已逾期 ${-left} 天` : `${left} 天后`}</small></div>
            <span className="chkrow__st chkrow__st--open" aria-hidden="true">{left < 0 ? '!' : '○'}</span>
          </button>
        ))}
        {done.map(r => (
          <button key={r.id} className="chkrow" onClick={() => go(r.date)}>
            <div className="chkrow__d"><small>{r.date.slice(5, 7)}月</small><b>{r.date.slice(8)}</b></div>
            <span className={`chkrow__thumb k-${r.kind}`}>{KIND[r.kind].e}</span>
            <div className="chkrow__tx"><b>{r.kind === 'weight' ? `体重 ${r.value} kg` : r.name}</b><small>已完成</small></div>
            <span className="chkrow__st chkrow__st--ok" aria-hidden="true">✓</span>
          </button>
        ))}
        {!rem.length && !done.length && <div className="empty">还没有打卡记录</div>}
      </div>
    </>
  );
}
