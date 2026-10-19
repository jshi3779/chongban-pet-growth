import { useApp } from '../ctx';
import type { Post } from '../types';

const AVATAR = ['🐱', '🐶', '🐰', '🐹', '🐾'];
const face = (name: string) => AVATAR[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR.length];

function Card({ p }: { p: Post }) {
  const { openDetail, like } = useApp();
  return (
    <article className="post" data-post={p.id}>
      <button className="post__open" aria-label={`查看帖子：${p.title}`} onClick={() => openDetail(p.id)}>
        {p.img
          ? <img className={`post__img post__img--${p.shape}`} src={`${import.meta.env.BASE_URL}assets/${p.img}`} alt={p.title} loading="lazy" />
          : <div className={`post__txt post__img--${p.shape}`}><p>{p.body}</p></div>}
        <h3>{p.title}</h3>
      </button>
      <div className="post__foot">
        <span className="post__by"><i>{face(p.author)}</i>{p.author}</span>
        <button className={`post__like ${p.liked ? 'on' : ''}`} data-like={p.id} aria-label={p.liked ? '取消点赞' : '点赞'} aria-pressed={p.liked} onClick={() => like(p.id)}>
          {p.liked ? '♥' : '♡'} {p.likes}
        </button>
      </div>
      {p.km != null && <span className="post__km">📍 {p.place} · {p.km} km</span>}
    </article>
  );
}

export function Community() {
  const { s, patch, openPost } = useApp();
  const nearby = s.comm === 'nearby';
  const list = nearby ? s.posts.filter(p => p.km != null).sort((a, b) => (a.km as number) - (b.km as number)) : s.posts;
  const cols = [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)];
  return (
    <>
      <nav className="commnav" aria-label="社区分类">
        <button className={!nearby ? 'on' : ''} data-comm="recommend" onClick={() => patch({ comm: 'recommend' })}>推荐</button>
        <button className={nearby ? 'on' : ''} data-comm="nearby" onClick={() => patch({ comm: 'nearby' })}>附近宠友</button>
      </nav>
      {nearby && <p className="commhint">📍 按距离由近到远 · 当前位置：上海徐汇（示例）</p>}
      {list.length ? (
        <div className="feed">{cols.map((c, i) => <div key={i} className="feed__col">{c.map(p => <Card key={p.id} p={p} />)}</div>)}</div>
      ) : <div className="empty">附近还没有帖子，发一条吧</div>}
      <button className="fab" data-act="newpost" aria-label="发布帖子" onClick={openPost}>＋</button>
    </>
  );
}
