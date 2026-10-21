import { useState } from 'react';
import { useApp } from '../ctx';
import type { Post } from '../types';
import { nearbyPosts } from '../product';

const AVATAR = ['🐱', '🐶', '🐰', '🐹', '🐾'];
const face = (name: string) => AVATAR[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR.length];

function Card({ p }: { p: Post }) {
  const { openDetail, like } = useApp();
  return <article className="post" data-post={p.id}>
    <button className="post__open" aria-label={`查看帖子：${p.title}`} onClick={() => openDetail(p.id)}>
      {p.img ? <img className={`post__img post__img--${p.shape}`} src={`${import.meta.env.BASE_URL}assets/${p.img}`} alt={p.title} loading="lazy" />
        : <div className={`post__txt post__img--${p.shape}`}><p>{p.body || p.title}</p></div>}
      <h3>{p.title}</h3>
    </button>
    <span className="post__status">{p.mine ? '我的日常 · 仅存本机' : '示例日常'}{p.petType ? ` · ${p.petType}` : ''}</span>
    <div className="post__foot"><span className="post__by"><i>{face(p.author)}</i>{p.author}</span>
      <button className={`post__like ${p.liked ? 'on' : ''}`} data-like={p.id} aria-label={p.liked ? '取消点赞' : '点赞'} aria-pressed={p.liked} onClick={() => like(p.id)}>{p.liked ? '♥' : '♡'} {p.likes}</button>
    </div>
    {p.city && <span className="post__km">📍 {p.city} {p.district}</span>}
  </article>;
}

export function Community() {
  const { s, patch, openPost } = useApp();
  const [petType, setPetType] = useState('全部');
  const [regionForm, setRegionForm] = useState(false);
  const nearby = s.comm === 'nearby';
  const list = nearby ? nearbyPosts(s.posts, s.region.city, s.region.district, petType) : s.posts;
  const cols = [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)];
  return <>
    <nav className="commnav" aria-label="社区分类">
      <button className={!nearby ? 'on' : ''} data-comm="recommend" onClick={() => patch({ comm: 'recommend' })}>推荐</button>
      <button className={nearby ? 'on' : ''} data-comm="nearby" onClick={() => patch({ comm: 'nearby' })}>附近宠友</button>
    </nav>
    <p className="product-note">本机社区体验：示例帖子与本机日常，不连接真实宠友；点赞仅存本机。</p>
    {nearby && <section className="sd-card card">
      <h3>找到同城的养宠日常</h3>
      <p className="product-note">手动选择城市与区县，不读取 GPS，也不显示精确距离。示例数据来自上海。</p>
      <button className="sd-btn sd-btn--default" aria-expanded={regionForm} onClick={() => setRegionForm(!regionForm)}>地区：{s.region.city || '请选择城市'} {s.region.district}</button>
      {(regionForm || !s.region.city) && <form className="region-form" key={`${s.region.city}-${s.region.district}`} onSubmit={e => {
        e.preventDefault(); const d = new FormData(e.currentTarget);
        patch({ region: { city: String(d.get('city')).trim(), district: String(d.get('district')).trim() } }); setRegionForm(false);
      }}>
        <label>城市<input className="sd-input" name="city" required pattern=".*\S.*" maxLength={20} defaultValue={s.region.city} placeholder="例如：上海" /></label>
        <label>区县（可选，留空看全城）<input className="sd-input" name="district" maxLength={20} defaultValue={s.region.district} placeholder="例如：徐汇" /></label>
        <button className="sd-btn sd-btn--primary">保存地区</button>
      </form>}
      <div className="region-filters" aria-label="宠物类型">{['全部', '猫', '狗'].map(t => <button key={t} className={`chip ${petType === t ? 'on' : ''}`} aria-pressed={petType === t} onClick={() => setPetType(t)}>{t}</button>)}</div>
      <p className="product-note">{s.region.city ? `${s.region.city} ${s.region.district} · ${list.length} 条匹配日常` : '选择地区后查看匹配结果'}</p>
    </section>}
    {list.length ? <div className="feed">{cols.map((c, i) => <div key={i} className="feed__col">{c.map(p => <Card key={p.id} p={p} />)}</div>)}</div>
      : <div className="empty">{s.region.city ? '暂无匹配日常，试试清空区县或切换宠物类型，也可以写下第一条。' : '先选城市，再遇见同城日常。'}</div>}
    <button className="fab" data-act="newpost" aria-label="发布帖子" onClick={() => openPost()}>＋</button>
  </>;
}
