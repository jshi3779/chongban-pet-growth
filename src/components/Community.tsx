import { useApp } from '../ctx';
import { Photo } from './Common';

function Coming({ ic, t, d, fake }: { ic: string; t: string; d: string; fake: [string, string][] }) {
  const { soon } = useApp();
  return (
    <div className="sd-card card coming">
      <div className="ic">{ic}</div>
      <h3 className="center">{t}</h3>
      <p>{d}</p>
      <button className="sd-btn sd-btn--primary" data-soon={t} onClick={() => soon(t)}>开启后通知我</button>
      <div className="fake">
        {fake.map(f => (
          <div key={f[0]} className="sd-row row"><div className="avatar avatar--sm">🐾</div><div className="sd-row__grow"><b>{f[0]}</b><br /><small>{f[1]}</small></div></div>
        ))}
      </div>
    </div>
  );
}

export function Community() {
  const { s, patch } = useApp();
  const seg = s.seg;
  return (
    <>
      <div className="community-intro"><span className="eyebrow">LITTLE MOMENTS, BIG LOVE</span><h2>每一份可爱，都值得被看见。</h2></div>
      <div className="stories" aria-label="宠物灵感照片">
        <Photo src="dog.jpg" alt="阳光下的金毛犬" />
        <Photo src="cat.jpg" alt="好奇的小猫" />
        <Photo src="cat-memory.jpg" alt="猫咪的悠闲时光" />
      </div>
      <div className="care-note"><span>每日小贴士</span><strong>把陪伴，写进每一个日常。</strong></div>
      <div className="filters segmented">
        <button className={`chip ${seg === 'friends' ? 'on' : ''}`} data-seg="friends" onClick={() => patch({ seg: 'friends' })}>📍 附近宠友</button>
        <button className={`chip ${seg === 'share' ? 'on' : ''}`} data-seg="share" onClick={() => patch({ seg: 'share' })}>💬 养宠广场</button>
      </div>
      {seg === 'friends'
        ? <Coming ic="📍" t="附近宠友" d="按地域匹配同城宠友，交流养宠经验、约遛弯。" fake={[['小橘 · 橘猫', '距你 0.8km · 徐汇'], ['Coco · 柯基', '距你 1.5km · 徐汇'], ['布丁 · 金毛', '距你 2.3km · 长宁']]} />
        : <Coming ic="💬" t="养宠广场" d="分享养宠日常，图文打卡，评论互动。" fake={[['今天第一次洗澡成功！', '年糕的铲屎官 · 12 赞'], ['新手养猫避坑指南', '猫奴小王 · 86 赞']]} />}
    </>
  );
}
