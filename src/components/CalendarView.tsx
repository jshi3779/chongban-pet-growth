import { useState } from 'react';
import { useApp } from '../ctx';
import { KIND, calInit, recsOf, reminders, today, ymd } from '../utils';
import { isHealth, withDemo } from '../demo';
import type { PetRecord } from '../types';
import { HealthActivity } from './HealthActivity';
import { healthActivity } from '../product';
import { PetSwitch } from './Common';

const WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const parse = (d: string) => new Date(`${d}T00:00:00`);
const fmt = (d: Date) => ymd(d.getFullYear(), d.getMonth(), d.getDate());
export function CalendarView() {
  const { s: real, pet, patch, openHistory } = useApp();
  const { st: s, demo } = withDemo(real, pet.id);
  const [open, setOpen] = useState(false);
  const c = s.cal || calInit();
  const sel = c.sel || today();
  const all = recsOf(s, pet.id).filter(isHealth);
  const byDay: Record<string, PetRecord[]> = {};
  const dueDay: Record<string, PetRecord> = {};
  all.forEach(r => { (byDay[r.date] = byDay[r.date] || []).push(r); if (r.next) dueDay[r.next] = r; });

  const go = (d: string) => { const t = parse(d); patch({ cal: { y: t.getFullYear(), m: t.getMonth(), sel: d } }); };
  const selectActivity = (d: string) => patch({ cal: { ...c, sel: d } });

  // 图一风格的打卡列表：待办（来自到期提醒）在前，已完成记录在后
  const rem = reminders(s, pet.id);
  const y0 = c.y, m0 = c.m;
  const lead = (new Date(y0, m0, 1).getDay() + 6) % 7, dim = new Date(y0, m0 + 1, 0).getDate();
  const shiftMonth = (n: number) => { const t = new Date(y0, m0 + n, 1); go(fmt(t)); };
  const step = (n: number) => shiftMonth(n * (open ? 1 : 3));
  const range = healthActivity(s, pet.id, y0, m0);
  const first = range.months[0], last = range.months[2];
  const monthLabel = open ? `${y0}年${m0 + 1}月` : first.year === last.year ? `${last.year}年${first.month}—${last.month}月` : `${first.year}.${first.month}—${last.year}.${last.month}`;


  return (
    <>
      <PetSwitch />
      <div className="caltop">

        <div className="monthpill">
          <button className="x" aria-label={open ? '上个月' : '前3个月'} data-calnav="-1" onClick={() => step(-1)}>‹</button>
          <span>{monthLabel}</span>
          <button className={`x expand ${open ? 'open' : ''}`} aria-label={open ? '收起月历' : '展开整月'} aria-expanded={open} data-calexpand onClick={() => setOpen(v => !v)}>
            <svg viewBox="0 0 24 24" className="chev"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <button className="x" aria-label={open ? '下个月' : '后3个月'} data-calnav="1" onClick={() => step(1)}>›</button>
        </div>
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
          <div className="legend"><i className="dot vaccine" />疫苗 <i className="dot deworm" />驱虫 <i className="dot due" />到期日</div>
        </div>
      ) : (
        <HealthActivity s={s} pid={pet.id} year={y0} month={m0} selected={sel} onSelect={selectActivity} demo={demo} />
      )}


      <div className="sec calendar-heading"><span>待办提醒</span><button className="calendar-all" aria-label={`全部健康记录（${all.length}条）`} onClick={openHistory}>全部<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg></button></div>
      <div className="chk">
        {rem.map(({ r, left }) => (
          <button key={`u${r.id}`} className="chkrow" onClick={() => go(r.next as string)}>
            <div className="chkrow__d"><small>{(r.next as string).slice(5, 7)}月</small><b>{(r.next as string).slice(8)}</b></div>
            <span className={`chkrow__thumb k-${r.kind}`}>{KIND[r.kind].e}</span>
            <div className="chkrow__tx"><b>{r.name}</b><small>{left < 0 ? `已逾期 ${-left} 天` : `${left} 天后`}</small></div>
            <span className="chkrow__st chkrow__st--open" aria-hidden="true">{left < 0 ? '!' : '○'}</span>
          </button>
        ))}
        {!rem.length && <div className="empty">暂无已录入的待办</div>}
      </div>
    </>
  );
}
