import { healthActivity } from '../product';
import { today } from '../utils';
import type { AppState } from '../types';

export function HealthActivity({ s, pid, year, month, selected, onSelect, demo }: { s: AppState; pid: string; year: number; month: number; selected: string; onSelect: (date: string) => void; demo: boolean }) {
  const activity = healthActivity(s, pid, year, month);
  return <section className="health-activity" aria-label="近三个月健康活动">
    <div className="activity-heading"><h3>照护活动</h3><span>近3个月 · {activity.total}条{demo ? ' · 示例' : ''}</span></div>
    <div className="activity-grid" aria-label={`${activity.start}至${activity.end}的每日健康记录`}>
      {activity.cells.map((date, index) => date ? <button key={date} type="button" className={`activity-cell activity-level-${Math.min(activity.counts[date] || 0, 4)} ${date === selected ? 'is-selected' : ''}`} data-activity-day={date} aria-label={`${date}，${activity.counts[date] || 0}条记录${date > today() ? '，未来日期' : ''}`} aria-pressed={date === selected} title={`${date} · ${activity.counts[date] || 0}条疫苗/驱虫记录`} disabled={date > today()} onClick={() => onSelect(date)} /> : <span className="activity-blank" key={`blank${index}`} aria-hidden="true" />)}
    </div>
    <div className="activity-months">{activity.months.map(m => <span key={`${m.year}-${m.month}`}>{m.month}月</span>)}</div>
    <div className="activity-footer"><span>{selected} · {activity.counts[selected] || 0}条记录</span><span className="activity-legend" aria-label="颜色由浅到深表示每天0、1、2、3、4条及以上记录">少{[0, 1, 2, 3, 4].map(level => <i key={level} className={`activity-level-${level}`} />)}多</span></div>
  </section>;
}
