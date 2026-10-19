import { useApp } from '../ctx';
import { KIND, calInit, recsOf, streak, today, ymd } from '../utils';
import type { Kind, PetRecord } from '../types';
import { PetSwitch, RecRow } from './Common';

const KINDS: Kind[] = ['weight', 'vaccine', 'deworm', 'milestone'];

export function CalendarView() {
  const { s, pet, patch, openRecord } = useApp();
  const c = s.cal || calInit();
  const all = recsOf(s, pet.id);
  const byDay: Record<string, PetRecord[]> = {};
  const dueDay: Record<string, PetRecord> = {};
  all.forEach(r => { (byDay[r.date] = byDay[r.date] || []).push(r); if (r.next) dueDay[r.next] = r; });
  const first = new Date(c.y, c.m, 1).getDay(), dim = new Date(c.y, c.m + 1, 0).getDate();
  const nav = (n: number) => {
    let m = c.m + n, y = c.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    patch({ cal: { y, m, sel: null } });
  };
  let checked = 0;
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(<span key={`b${i}`} />);
  for (let d = 1; d <= dim; d++) {
    const k = ymd(c.y, c.m, d), list = byDay[k] || [];
    if (list.length) checked++;
    const kinds = [...new Set(list.map(r => r.kind))];
    cells.push(
      <button key={k} className={`day ${k === today() ? 'today' : ''} ${k === c.sel ? 'sel' : ''} ${list.length ? 'done' : ''}`} data-day={k} onClick={() => patch({ cal: { ...c, sel: k } })}>
        <b>{d}</b>
        <em>{kinds.map(x => <u key={x} className={`dot ${x}`} />)}{dueDay[k] && !list.length && <u className="dot due" />}</em>
      </button>,
    );
  }
  const sel = c.sel || today(), sl = byDay[sel] || [], due = dueDay[sel], future = sel > today();
  return (
    <>
      <PetSwitch />
      <div className="sd-card card">
        <div className="calhead"><button className="x" data-calnav="-1" aria-label="上个月" onClick={() => nav(-1)}>‹</button><b>{c.y}年{c.m + 1}月</b><button className="x" data-calnav="1" aria-label="下个月" onClick={() => nav(1)}>›</button></div>
        <div className="stats stats--mb">
          <div className="sd-stat"><strong>{streak(s, pet.id)}</strong><span>连续打卡 天</span></div>
          <div className="sd-stat"><strong>{checked}</strong><span>本月已打卡 天</span></div>
          <div className="sd-stat"><strong>{all.length}</strong><span>累计记录</span></div>
        </div>
        <div className="week">{['日', '一', '二', '三', '四', '五', '六'].map(x => <span key={x}>{x}</span>)}</div>
        <div className="grid">{cells}</div>
        <div className="legend"><i className="dot weight" />体重 <i className="dot vaccine" />疫苗 <i className="dot deworm" />驱虫 <i className="dot milestone" />瞬间 <i className="dot due" />到期日</div>
      </div>
      <div className="sd-card card">
        <h3>{sel}{sel === today() ? '（今天）' : ''}<small>{sl.length ? '已打卡 ✓' : '未打卡'}</small></h3>
        {due && !sl.length && <div className="sd-row row"><div className="sd-row__grow"><b>{KIND[due.kind].e} {due.name} 到期</b><br /><small>别忘了今天安排哦</small></div></div>}
        {sl.map(r => <RecRow key={r.id} r={r} />)}
        {!sl.length && <div className="empty">{future ? '未来的日子，还不能打卡' : '这天还没有记录'}</div>}
        {!future && (
          <div className="quick quick--mt">
            {KINDS.map(k => <button key={k} data-add={k} data-date={sel} onClick={() => openRecord(k, sel)}><i>{KIND[k].e}</i>打卡{KIND[k].n}</button>)}
          </div>
        )}
      </div>
    </>
  );
}
