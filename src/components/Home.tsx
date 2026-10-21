import { CareCompanion } from './CareCompanion';
import { WeightPanel } from './WeightPanel';
import { useApp } from '../ctx';
import { age, recsOf } from '../utils';
import { careSummary } from '../product';
import { Photo, PetAvatar, PetSwitch } from './Common';

export function Home() {
  const { s, pet, openPet, openRecord, openPost, go, patch } = useApp();
  const { week } = careSummary(s, pet);
  const moments = recsOf(s, pet.id, 'milestone').length;
  const cover = pet.type === '猫' ? 'profile-cat-cutout.webp' : pet.type === '狗' ? 'dog.jpg' : null;
  return <>
    <section className="profile-cover">
      <header className="profile-toolbar"><h1>我的宠物</h1><button aria-label="添加宠物" title="添加宠物" data-act="addpet" onClick={openPet}>＋</button></header>
      {s.pets.length > 1 && <div className="profile-switch"><PetSwitch /></div>}
      {cover ? <img className={`profile-cover__pet ${pet.type === '猫' ? 'is-cutout' : ''}`} src={`${import.meta.env.BASE_URL}assets/${cover}`} alt={`${pet.name}的示例封面照片`} /> : <div className="profile-cover__fallback"><PetAvatar pet={pet} /></div>}
      <span className="profile-photo-label">示例封面</span>
    </section>
    <section className="profile-summary pethead">
      <h2>{pet.name}</h2>
      <div className="profile-meta"><span>{pet.gender === '♀' ? '♀' : '♂'} {pet.breed || pet.type}</span><span>🎂 {pet.birthday || '生日未填'}</span>{pet.birthday && <span>{age(pet.birthday)}</span>}</div>
      <div className="profile-social">
        <div><div className="profile-avatar-stack">{s.pets.slice(0, 4).map(p => <PetAvatar key={p.id} pet={p} />)}</div><small>{s.pets.length}位家庭小伙伴</small></div>
        <div><div className="profile-moments" aria-hidden="true"><i>♡</i><i>✦</i><i>♧</i></div><small>{moments}个成长瞬间</small></div>
      </div>
      <div className="profile-shortcuts">
        <button className="is-primary" data-add="weight" onClick={() => openRecord('weight')}><i aria-hidden="true">⚖</i><span>记体重</span></button>
        <button data-act="view-health" onClick={() => go('calendar')}><i aria-hidden="true">▦</i><span>健康日历</span></button>
        <button data-act="share-growth" onClick={() => openPost({ title: `${pet.name}的成长小记`, body: `这周和${pet.name}一起留下了${week.length}条成长记录。最想记住的小事是：\n` })}><i aria-hidden="true">♡</i><span>晒日常</span></button>
        <button data-act="find-nearby" onClick={() => { patch({ comm: 'nearby' }); go('community'); }}><i aria-hidden="true">⌖</i><span>附近宠友</span></button>
      </div>
    </section>
    <div className="sd-card card album">
      <h3>成长相册<small>灵感照片 · 示例</small></h3>
      <div className="collage"><Photo cls="a" src="cat.jpg" alt="猫咪的好奇瞬间" /><Photo cls="b" src="dog.jpg" alt="狗狗的户外时光" /><Photo cls="c" src="cat-memory.jpg" alt="猫咪的午后" /></div>
      <div className="album-footer"><span>♡ 小小瞬间，慢慢收藏</span><span>OUR MEMORIES</span></div>
    </div>
    <WeightPanel showEntry={false} />
    <CareCompanion showActions={false} />
  </>;
}
