import { CareCompanion } from './CareCompanion';
import { WeightPanel } from './WeightPanel';
import { useApp } from '../ctx';
import { age } from '../utils';
import { Photo, PetAvatar } from './Common';

export function Home() {
  const { s, pet, patch, openPet } = useApp();
  return <>

    <header className="page-title"><h1>我的宠物</h1><button className="add-pet-link" data-act="addpet" aria-label="添加宠物" onClick={openPet}>＋ 添加宠物</button></header>
    <section className="pethead">
      <span className="bigface"><PetAvatar pet={pet} /></span>
      <div className="pethead__info"><h2>{pet.name} <small>{pet.gender === '♀' ? '♀' : '♂'}</small></h2><div className="meta"><span>{pet.breed || pet.type}</span><span>{pet.birthday ? age(pet.birthday) : '年龄未填'}</span><span>🎂 {pet.birthday || '生日未填'}</span></div></div>
    </section>
    {s.pets.length > 1 && <div className="pets" aria-label="切换宠物">{s.pets.filter(q => q.id !== pet.id).map(q => <button key={q.id} className="chip pet-chip" data-pet={q.id} onClick={() => patch({ cur: q.id })}><PetAvatar pet={q} /><span>{q.name}</span></button>)}</div>}
    <div className="sd-card card album">
      <h3>成长相册<small>灵感照片 · 示例</small></h3>
      <div className="collage"><Photo cls="a" src="cat.jpg" alt="猫咪的好奇瞬间" /><Photo cls="b" src="dog.jpg" alt="狗狗的户外时光" /><Photo cls="c" src="cat-memory.jpg" alt="猫咪的午后" /></div>
      <div className="album-footer"><span>♡ 小小瞬间，慢慢收藏</span><span>OUR MEMORIES</span></div>
    </div>
    <WeightPanel />
    <CareCompanion />
  </>;
}
