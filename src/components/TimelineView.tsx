import { useApp } from '../ctx';
import { KIND, age, dayDiff, recsOf } from '../utils';
import { isLife, withDemo } from '../demo';
import type { AppState, PetRecord } from '../types';
import { Mascot } from './Mascot';
import { PetSwitch } from './Common';

type F = Extract<AppState['filter'], 'all' | 'weight' | 'milestone'>;
const FILTERS: [F, string][] = [['all', '全部'], ['weight', '体重'], ['milestone', '成长瞬间']];
const MONTH = 30.4;

/** 月龄标签：0=出生月，<12 显示「N月龄」，之后显示「N岁M月」 */
function label(m: number) {
  if (m === 0) return '出生';
  if (m < 12) return `${m}月龄`;
  return `${Math.floor(m / 12)}岁${m % 12 ? `${m % 12}月` : ''}`;
}

export function TimelineView() {
  const { s: real, pet, patch, openRecord, del } = useApp();
  const { st: s, demo } = withDemo(real, pet.id);
  const filter: F = s.filter === 'weight' || s.filter === 'milestone' ? s.filter : 'all';

  const life = recsOf(s, pet.id).filter(isLife);
  const asc = [...life].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
  const base = pet.birthday || (asc[0] ? asc[0].date : new Date().toISOString().slice(0, 10));
  const idx = (d: string) => Math.max(0, Math.floor(dayDiff(d, base) / MONTH));

  // 体重变化：与上一条体重相比
  const weights = asc.filter(r => r.kind === 'weight');
  const maxW = Math.max(...weights.map(r => r.value as number), 1);
  const delta: Record<number, number | null> = {};
  weights.forEach((r, i) => { delta[r.id] = i ? +((r.value as number) - (weights[i - 1].value as number)).toFixed(2) : null; });

  const shown = life.filter(r => filter === 'all' || r.kind === filter);
  const groups = new Map<number, PetRecord[]>();
  shown.forEach(r => { const k = idx(r.date); groups.set(k, [...(groups.get(k) || []), r]); });
  const nowIdx = idx(new Date().toISOString().slice(0, 10));
  groups.set(0, groups.get(0) || []);      // 出生刻度始终存在（尺子的零点）
  groups.set(nowIdx, groups.get(nowIdx) || []); // 「现在」刻度
  const keys = [...groups.keys()].sort((a, b) => b - a); // 越往上越大 = 越成长

  const cur = weights.length ? weights[weights.length - 1] : null;
  const rows: JSX.Element[] = [];
  keys.forEach((k, i) => {
    const list = (groups.get(k) || []).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
    rows.push(
      <section key={`s${k}`} className={`seg ${list.length ? '' : 'seg--empty'}`} data-month={k}>
        <div className="seg__ruler"><span className="seg__tick" /><b className="seg__label">{k === nowIdx ? '现在' : label(k)}</b>{k === nowIdx && k !== 0 && <small>{label(k)}</small>}</div>
        <div className="seg__body">
          {list.map(r => (
            <article key={r.id} className={`ev ev--${r.kind}`} data-rec={r.id}>
              <span className="ev__ic">{KIND[r.kind].e}</span>
              <div className="ev__tx">
                {r.kind === 'weight' ? (
                  <>
                    <b className="ev__big">{r.value}<small> kg</small>
                      {delta[r.id] != null && <em className={`ev__delta ${(delta[r.id] as number) >= 0 ? 'up' : 'down'}`}>{(delta[r.id] as number) >= 0 ? '▲' : '▼'} {Math.abs(delta[r.id] as number)}</em>}
                    </b>
                    <span className="ev__bar" role="img" aria-label={`体重占历史最高的 ${Math.round(((r.value as number) / maxW) * 100)}%`}><i style={{ width: `${((r.value as number) / maxW) * 100}%` }} /></span>
                  </>
                ) : (
                  <b>{r.name}</b>
                )}
                {r.note && <small className="ev__note">{r.note}</small>}
                <small className="ev__date">{r.date.slice(5).replace('-', '月')}日 · {pet.birthday || demo ? `出生第 ${Math.max(0, dayDiff(r.date, base))} 天` : ''}</small>
              </div>
              {r.id > 0 ? <button className="x" data-del={r.id} aria-label="删除" onClick={() => del(r.id)}>删除</button> : <span className="demotag">示例</span>}
            </article>
          ))}
          {k === 0 && !list.length && <p className="seg__hint">{pet.birthday ? `🎂 ${pet.birthday} 来到这个世界` : '成长的起点'}</p>}
        </div>
      </section>,
    );
    const next = keys[i + 1];
    if (next != null && k - next > 1) rows.push(<div key={`g${k}`} className="gap" style={{ height: `calc(var(--space-lg) * ${Math.min(k - next - 1, 4)})` }}><small>中间 {k - next - 1} 个月</small></div>);
  });

  return (
    <>
      <PetSwitch />
      <header className="growth">
        <div className="growth__m"><Mascot type={pet.type} label={`${pet.name}的宠物形象`} /></div>
        <div>
          <h2>{pet.name}的成长尺</h2>
          <p>{pet.birthday ? `${age(pet.birthday)}` : '成长中'}{cur ? ` · 现在 ${cur.value} kg` : ''}{demo && <span className="demotag demotag--lg">示例</span>}</p>
        </div>
      </header>
      <div className="quick quick--mb quick--two">
        <button data-add="weight" onClick={() => openRecord('weight')}><i>⚖️</i>记体重</button>
        <button data-add="milestone" onClick={() => openRecord('milestone')}><i>🎉</i>成长瞬间</button>
      </div>
      <div className="filters">
        {FILTERS.map(([k, n]) => <button key={k} className={`chip ${filter === k ? 'on' : ''}`} data-filter={k} onClick={() => patch({ filter: k })}>{n}</button>)}
      </div>
      <div className="ruler" aria-label={`${pet.name}的成长时间轴，越往上越成长`}>
        <p className="ruler__top">↑ 越往上，{pet.name}越大</p>
        {rows}
      </div>
    </>
  );
}
