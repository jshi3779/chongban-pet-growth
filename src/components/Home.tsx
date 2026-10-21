import { CareCompanion } from './CareCompanion';
import { WeightPanel } from './WeightPanel';
import { useApp } from '../ctx';
import { EMOJI, age } from '../utils';
import { Mascot } from './Mascot';
import { Photo } from './Common';

export function Home() {
  const { s, pet, patch, openPet } = useApp();
  return <>

    <section className="pethead">
      <div className="pethead__row">
        <span className="bigface"><Mascot type={pet.type} label={`${pet.name}的黏土形象`} /></span>
        {s.pets.filter(q => q.id !== pet.id).map(q => <button key={q.id} className="face" data-pet={q.id} aria-label={`切换到${q.name}`} onClick={() => patch({ cur: q.id })}>{EMOJI[q.type] || '🐾'}</button>)}
        <button className="face add" data-act="addpet" aria-label="添加宠物" onClick={openPet}>＋</button>
      </div>
      <h2>{pet.name}</h2>
      <div className="meta"><span>{pet.type} · {pet.breed || '未填品种'}</span><span>{pet.gender === '♀' ? '女孩' : '男孩'}</span><span>{pet.birthday ? age(pet.birthday) : '年龄未填'}</span><span>🎂 {pet.birthday || '生日未填'}</span></div>
    </section>
    <p className="product-promise">记录成长，理清照护，在同城遇见懂你的人。</p>
    <div className="sd-card card album">
      <h3>成长相册<small>灵感照片 · 示例</small></h3>
      <div className="collage"><Photo cls="a" src="cat.jpg" alt="猫咪的好奇瞬间" /><Photo cls="b" src="dog.jpg" alt="狗狗的户外时光" /><Photo cls="c" src="cat-memory.jpg" alt="猫咪的午后" /></div>
      <div className="album-footer"><span>♡ 小小瞬间，慢慢收藏</span><span>OUR MEMORIES</span></div>
    </div>
    <WeightPanel />
    <CareCompanion />
  </>;
}
