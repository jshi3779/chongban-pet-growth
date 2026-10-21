import { useState } from 'react';
import { CareCompanion } from './CareCompanion';
import { WeightPanel } from './WeightPanel';
import { useApp } from '../ctx';
import { age, recsOf } from '../utils';
import { Photo, PetAvatar, PetSwitch } from './Common';

export function Home() {
  const { s, pet, openPet, openArchive } = useApp();
  const [settings, setSettings] = useState(false);
  const moments = recsOf(s, pet.id, 'milestone').length;
  const cover = pet.type === '猫' ? 'profile-cat-cutout.webp' : pet.type === '狗' ? 'dog.jpg' : null;
  return <>
    <section className="profile-cover">
      <header className="profile-toolbar"><button className="profile-settings" aria-label="设置" onClick={() => setSettings(true)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2 3 3 .5.5 3 2 2-2 2-.5 3-3 .5-2 3-2-3-3-.5-.5-3-2-2 2-2 .5-3L10 6z"/><circle cx="12" cy="11.5" r="3"/></svg></button><h1>我的宠物</h1><button aria-label="添加宠物" title="添加宠物" data-act="addpet" onClick={openPet}>＋</button></header>
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

    </section>
    <div className="sd-card card album">
      <h3>成长相册<small>灵感照片 · 示例</small></h3>
      <div className="collage"><Photo cls="a" src="cat.jpg" alt="猫咪的好奇瞬间" /><Photo cls="b" src="dog.jpg" alt="狗狗的户外时光" /><Photo cls="c" src="cat-memory.jpg" alt="猫咪的午后" /></div>
    </div>
    <WeightPanel />
    <CareCompanion showActions={false} />
    {settings && <div className="sheet"><div className="mask" onClick={() => setSettings(false)} /><section className="panel" role="dialog" aria-modal="true" aria-label="设置"><h4>设置</h4><p className="product-note">宠物资料与记录保存在当前浏览器。</p><button className="sd-btn sd-btn--default" onClick={() => { setSettings(false); openArchive(); }}>档案导出与备份</button><div className="act"><button className="sd-btn sd-btn--default" onClick={() => setSettings(false)}>关闭</button></div></section></div>}
  </>;
}
