import { useApp } from '../ctx';
import { EMOJI } from '../utils';
import type { Pet } from '../types';


export function Photo({ cls, src, alt }: { cls?: string; src: string; alt: string }) {
  return (
    <figure className={`pet-photo ${cls || ''}`}>
      <img src={`${import.meta.env.BASE_URL}assets/${src}`} alt={alt} loading="lazy" />
      <figcaption>灵感照片 · 示例</figcaption>
    </figure>
  );
}

export function PetAvatar({ pet }: { pet: Pet }) {
  const photo = pet.type === '猫' ? 'cat.jpg' : pet.type === '狗' ? 'dog.jpg' : null;
  return <span className="pet-avatar" title={photo ? `${pet.name}的示例照片` : pet.name}>
    {photo ? <img src={`${import.meta.env.BASE_URL}assets/${photo}`} alt={`${pet.name}的示例照片`} /> : <span role="img" aria-label={pet.type}>{EMOJI[pet.type] || '🐾'}</span>}
  </span>;
}

export function PetSwitch() {
  const { s, pet, patch } = useApp();
  return <div className="pets" aria-label="切换宠物">
    {s.pets.map(p => <button key={p.id} className={`chip pet-chip ${p.id === pet.id ? 'on' : ''}`} data-pet={p.id} aria-label={`切换到${p.name}`} aria-pressed={p.id === pet.id} onClick={() => patch({ cur: p.id })}>
      <PetAvatar pet={p} /><span>{p.name}</span>
    </button>)}
  </div>;
}
