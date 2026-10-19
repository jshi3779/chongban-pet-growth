import { useApp } from '../ctx';
import { EMOJI, KIND, dayDiff, today } from '../utils';
import type { PetRecord } from '../types';

export function Photo({ cls, src, alt }: { cls?: string; src: string; alt: string }) {
  return (
    <figure className={`pet-photo ${cls || ''}`}>
      <img src={`${import.meta.env.BASE_URL}assets/${src}`} alt={alt} loading="lazy" />
      <figcaption>灵感照片 · 示例</figcaption>
    </figure>
  );
}

export function DueTag({ next, short }: { next: string; short?: boolean }) {
  const l = dayDiff(next, today());
  if (l < 0) return <span className="sd-tag sd-tag--error">已逾期{-l}天</span>;
  if (l <= 14) return <span className="sd-tag">{l}天后到期</span>;
  return <span className="sd-tag sd-tag--success">{short ? `${l}天后` : `下次 ${next}`}</span>;
}

export function RecRow({ r }: { r: PetRecord }) {
  const { del } = useApp();
  const k = KIND[r.kind];
  return (
    <div className="sd-row row">
      <div className="sd-row__grow">
        <b>{k.e} {r.kind === 'weight' ? `${r.value} kg` : r.name}</b>{' '}
        {r.next && <DueTag next={r.next} />}
        <br /><small>{r.date}{r.note ? ` · ${r.note}` : ''}</small>
      </div>
      <button className="x" data-del={r.id} onClick={() => del(r.id)}>删除</button>
    </div>
  );
}

export function PetSwitch() {
  const { s, pet, patch, openPet } = useApp();
  return (
    <div className="pets">
      {s.pets.map(p => (
        <button key={p.id} className={`chip ${p.id === pet.id ? 'on' : ''}`} data-pet={p.id} onClick={() => patch({ cur: p.id })}>
          {EMOJI[p.type] || '🐾'} {p.name}
        </button>
      ))}
      <button className="chip" data-act="addpet" onClick={openPet}>＋ 添加宠物</button>
    </div>
  );
}
