import { useApp } from '../ctx';
import { recsOf } from '../utils';

export function Chart() {
  const { s, pet } = useApp();
  const w = recsOf(s, pet.id, 'weight').slice().reverse();
  if (w.length < 2) return <div className="empty">至少记录 2 次体重才能生成曲线</div>;
  const W = 420, H = 170, p = { l: 34, r: 14, t: 14, b: 26 };
  const t0 = +new Date(w[0].date), t1 = +new Date(w[w.length - 1].date);
  const vs = w.map(x => x.value as number);
  let lo = Math.min(...vs), hi = Math.max(...vs);
  const pad = (hi - lo || 1) * 0.2; lo -= pad; hi += pad;
  const X = (d: string) => p.l + (t1 - t0 ? (+new Date(d) - t0) / (t1 - t0) : 0.5) * (W - p.l - p.r);
  const Y = (v: number) => p.t + (1 - (v - lo) / (hi - lo)) * (H - p.t - p.b);
  const pts = w.map(x => [X(x.date), Y(x.value as number)] as const);
  const last = pts[pts.length - 1];
  const line = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('');
  const area = `${line}L${last[0]} ${H - p.b}L${pts[0][0]} ${H - p.b}Z`;
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`}>
      {[0, 1, 2, 3].map(i => {
        const v = lo + ((hi - lo) * i) / 3, y = Y(v);
        return (
          <g key={i}>
            <line x1={p.l} x2={W - p.r} y1={y} y2={y} className="c-grid" />
            <text x={p.l - 6} y={y + 4} className="c-axis" textAnchor="end">{v.toFixed(1)}</text>
          </g>
        );
      })}
      <path d={area} className="c-area" />
      <path d={line} className="c-line" />
      {pts.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r="4.5" className="c-dot" />)}
      <text x={p.l} y={H - 6} className="c-axis">{w[0].date.slice(2)}</text>
      <text x={W - p.r} y={H - 6} className="c-axis" textAnchor="end">{w[w.length - 1].date.slice(2)}</text>
      <text x={last[0]} y={last[1] - 9} className="c-last" textAnchor="end">{w[w.length - 1].value}kg</text>
    </svg>
  );
}

