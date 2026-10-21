import { useApp } from '../ctx';
import { KIND, recsOf } from '../utils';
import { isHealth, withDemo } from '../demo';

export function HealthHistory({ onClose }: { onClose: () => void }) {
  const { s, pet, patch } = useApp();
  const { st, demo } = withDemo(s, pet.id);
  const list = recsOf(st, pet.id).filter(isHealth);
  return <section className="panel" id="form" role="dialog" aria-modal="true" aria-label="全部健康记录" data-health-history>
    <h4>全部健康记录</h4>
    <p className="product-note">{pet.name} · {list.length} 条{demo ? ' · 示例日程' : ''} · 点击记录查看对应日期</p>
    <div className="chk">{list.map(r => <button key={r.id} className="chkrow" onClick={() => { const date = new Date(`${r.date}T00:00:00`); patch({ cal: { y: date.getFullYear(), m: date.getMonth(), sel: r.date } }); onClose(); }}>
      <div className="chkrow__d"><small>{r.date.slice(5, 7)}月</small><b>{r.date.slice(8)}</b></div>
      <span className={`chkrow__thumb k-${r.kind}`}>{KIND[r.kind].e}</span>
      <div className="chkrow__tx"><b>{r.name}</b><small>{r.date}{r.next ? ` · 下次 ${r.next}` : ''}{r.note ? ` · ${r.note}` : ''}</small></div>
    </button>)}</div>
    {!list.length && <div className="empty">还没有健康记录</div>}
    <div className="product-actions"><button className="sd-btn sd-btn--default" data-close onClick={onClose}>关闭</button></div>
  </section>;
}
