import { useApp } from '../ctx';
import { EMOJI, KIND, age, iso, recsOf, reminders, streak } from '../utils';
import { Spark } from './Chart';
import { DueTag } from './Common';

export function Overview() {
  const { s, patch } = useApp();
  const rems = s.pets
    .flatMap(p => reminders(s, p.id).map(x => ({ p, ...x })))
    .sort((a, b) => a.left - b.left);
  const overdue = rems.filter(x => x.left < 0).length;
  const soonN = rems.filter(x => x.left >= 0 && x.left <= 14).length;
  const cnt: Record<string, number> = {};
  s.records.forEach(r => { cnt[r.date] = (cnt[r.date] || 0) + 1; });
  const heat = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = iso(d), n = cnt[k] || 0;
    heat.push(<i key={k} className={`h h${Math.min(n, 3)}`} title={`${k} ${n}条`} />);
  }
  return (
    <>
      <div className="sd-card card">
        <h3>全局总览</h3>
        <div className="stats c4">
          <div className="sd-stat"><strong>{s.pets.length}</strong><span>宠物</span></div>
          <div className="sd-stat"><strong>{s.records.length}</strong><span>总记录</span></div>
          <div className="sd-stat"><strong className={overdue ? 'is-error' : ''}>{overdue}</strong><span>已逾期</span></div>
          <div className="sd-stat"><strong>{soonN}</strong><span>14天内到期</span></div>
        </div>
      </div>
      <div className="sd-card card">
        <h3>我的宠物</h3>
        {s.pets.map(p => {
          const w = recsOf(s, p.id, 'weight')[0], nx = reminders(s, p.id)[0];
          return (
            <div key={p.id} className="sd-row row row--link" onClick={() => { patch({ cur: p.id, tab: 'home' }); scrollTo(0, 0); }}>
              <div className="avatar">{EMOJI[p.type] || '🐾'}</div>
              <div className="sd-row__grow">
                <b>{p.name}</b> <small>{p.birthday ? age(p.birthday) : ''} · 连续打卡{streak(s, p.id)}天</small><br />
                <small>{w ? `${w.value}kg` : '未记录体重'}{nx ? ` · 下次${nx.r.name} ${nx.r.next}` : ''}</small>
              </div>
              <Spark pid={p.id} />
            </div>
          );
        })}
      </div>
      <div className="sd-card card"><h3>近 28 天打卡<small>全部宠物</small></h3><div className="heat">{heat}</div></div>
      <div className="sd-card card">
        <h3>待办提醒<small>全部宠物</small></h3>
        {rems.length ? rems.slice(0, 6).map(x => (
          <div key={x.r.id} className="sd-row row">
            <div className="sd-row__grow"><b>{KIND[x.r.kind].e} {x.p.name} · {x.r.name}</b><br /><small>{x.r.next}</small></div>
            <DueTag next={x.r.next as string} short />
          </div>
        )) : <div className="empty">暂无待办 ✅</div>}
      </div>
    </>
  );
}
