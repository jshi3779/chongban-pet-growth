import { useApp } from '../ctx';
import { EMOJI } from '../utils';


export function Photo({ cls, src, alt }: { cls?: string; src: string; alt: string }) {
  return (
    <figure className={`pet-photo ${cls || ''}`}>
      <img src={`${import.meta.env.BASE_URL}assets/${src}`} alt={alt} loading="lazy" />
      <figcaption>灵感照片 · 示例</figcaption>
    </figure>
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
