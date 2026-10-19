import { useApp } from '../ctx';
import { KIND, dayDiff, recsOf } from '../utils';
import type { AppState } from '../types';
import { PetSwitch } from './Common';

const FILTERS: [AppState['filter'], string][] = [['all', '全部'], ['weight', '体重'], ['vaccine', '疫苗'], ['deworm', '驱虫'], ['milestone', '瞬间']];
const CLS = { weight: 'w', vaccine: '', deworm: 'd', milestone: 'm' } as const;

export function TimelineView() {
  const { s, pet, patch } = useApp();
  const L = recsOf(s, pet.id).filter(r => s.filter === 'all' || r.kind === s.filter);
  return (
    <>
      <PetSwitch />
      <div className="filters">
        {FILTERS.map(([k, n]) => <button key={k} className={`chip ${s.filter === k ? 'on' : ''}`} data-filter={k} onClick={() => patch({ filter: k })}>{n}</button>)}
      </div>
      <div className="sd-card card">
        <h3>{pet.name}的成长时间线<small>共 {L.length} 条</small></h3>
        {L.length ? (
          <div className="tl">
            {L.map(r => {
              const d = pet.birthday ? dayDiff(r.date, pet.birthday) : null;
              return (
                <div key={r.id} className={`it ${CLS[r.kind]}`}>
                  <div className="date">{r.date}{d != null && d >= 0 ? ` · 出生第${d}天` : ''}</div>
                  <div className="bd">
                    <b>{KIND[r.kind].e} {r.kind === 'weight' ? `体重 ${r.value} kg` : r.name}</b>
                    {r.note && <><br /><small className="note">{r.note}</small></>}
                    {r.next && <><br /><small className="note">下次 {r.next}</small></>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <div className="empty">暂无内容，去档案页添加记录吧</div>}
      </div>
    </>
  );
}
