import { useApp } from '../ctx';
import { EMOJI, KIND, age, recsOf, reminders } from '../utils';
import type { Kind } from '../types';
import { Chart } from './Chart';
import { DueTag, Photo, RecRow } from './Common';
import { Overview } from './Overview';

const QUICK: Kind[] = ['weight', 'vaccine', 'deworm', 'milestone'];

export function Home() {
  const { s, pet, patch, openRecord, openPet, del, soon } = useApp();
  const tab = s.htab;
  const w = recsOf(s, pet.id, 'weight');
  const L = recsOf(s, pet.id);
  const rem = reminders(s, pet.id);
  const goCommunity = () => { patch({ tab: 'community' }); scrollTo(0, 0); };
  return (
    <>
      <section className="pethead">
        <div className="pethead__row">
          <span className="bigface"><img src={`${import.meta.env.BASE_URL}assets/${pet.type === '狗' ? 'dog.jpg' : 'cat.jpg'}`} alt={`${pet.name}的示例照片`} /></span>
          {s.pets.filter(q => q.id !== pet.id).map(q => (
            <button key={q.id} className="face" data-pet={q.id} aria-label={`切换到${q.name}`} onClick={() => patch({ cur: q.id })}>{EMOJI[q.type] || '🐾'}</button>
          ))}
          <button className="face add" data-act="addpet" aria-label="添加宠物" onClick={openPet}>＋</button>
        </div>
        <h2>{pet.name}</h2>
        <div className="meta">
          <span>{pet.breed || pet.type}</span>
          <span>{pet.gender === '♀' ? '女孩' : '男孩'}</span>
          <span>{pet.birthday ? age(pet.birthday) : '年龄未填'}</span>
        </div>
      </section>
      <div className="tabs2">
        <button className={tab === 'timeline' ? 'on' : ''} data-htab="timeline" onClick={() => patch({ htab: 'timeline' })}>时间线</button>
        <button className={tab === 'profile' ? 'on' : ''} data-htab="profile" onClick={() => patch({ htab: 'profile' })}>档案资料</button>
      </div>

      {tab === 'timeline' ? (
        <>
          <div className="quick quick--mb">
            {QUICK.map(k => <button key={k} data-add={k} onClick={() => openRecord(k)}><i>{KIND[k].e}</i>{k === 'milestone' ? '瞬间' : KIND[k].n}</button>)}
          </div>
          {L.length ? L.map(r => {
            const k = KIND[r.kind];
            return (
              <article key={r.id} className={`tcard k-${r.kind}`}>
                <span className="tcard__ic">{k.e}</span>
                <div className="tcard__bd">
                  <div className="tcard__top"><b>{k.n}</b><small>{r.date}</small></div>
                  <p>{r.kind === 'weight' ? `体重 ${r.value} kg` : r.name}</p>
                  {r.note && <p className="note">{r.note}</p>}
                  {r.next && <DueTag next={r.next} />}
                  <div className="tcard__foot">更新于 我 <button className="x" data-del={r.id} onClick={() => del(r.id)}>删除</button></div>
                </div>
              </article>
            );
          }) : <div className="sd-card card empty">还没有记录，点上方按钮开始吧</div>}
        </>
      ) : (
        <>
          <div className="sd-card card">
            <div className="stats">
              <div className="sd-stat"><strong>{w[0] ? w[0].value : '-'}</strong><span>当前体重 kg</span></div>
              <div className="sd-stat"><strong>{recsOf(s, pet.id, 'vaccine').length}</strong><span>疫苗记录</span></div>
              <div className="sd-stat"><strong>{recsOf(s, pet.id, 'deworm').length}</strong><span>驱虫记录</span></div>
            </div>
            <div className="meta meta--mt"><span>{pet.type} · {pet.breed || '未填品种'}</span><span>🎂 {pet.birthday || '-'}</span></div>
          </div>
          <div className="bento">
            <button className="p" data-add="weight" onClick={() => openRecord('weight')}><i>⚖️</i>记体重</button>
            <button data-add="vaccine" onClick={() => openRecord('vaccine')}><i>💉</i>打疫苗</button>
            <button data-add="deworm" onClick={() => openRecord('deworm')}><i>🐛</i>驱虫</button>
            <button data-add="milestone" onClick={() => openRecord('milestone')}><i>🎉</i>成长瞬间</button>
            <button className="soon" data-tab="community" onClick={goCommunity}><i>📍</i>附近宠友</button>
            <button className="soon" data-tab="community" onClick={goCommunity}><i>📸</i>晒日常</button>
            <button className="soon" data-soon="就医记录" onClick={() => soon('就医记录')}><i>🏥</i>就医</button>
            <button className="soon" data-soon="宠物商城" onClick={() => soon('宠物商城')}><i>🛒</i>用品</button>
          </div>
          <div className="sd-card card album">
            <h3>成长相册<small>灵感照片 · 示例</small></h3>
            <div className="collage">
              <Photo cls="a" src="cat.jpg" alt="猫咪的好奇瞬间" />
              <Photo cls="b" src="dog.jpg" alt="狗狗的户外时光" />
              <Photo cls="c" src="cat-memory.jpg" alt="猫咪的午后" />
            </div>
            <div className="album-footer"><span>♡ 小小瞬间，慢慢收藏</span><span>OUR MEMORIES</span></div>
          </div>
          <div className="sd-card card">
            <h3>健康提醒<small>疫苗 / 驱虫到期</small></h3>
            {rem.length ? rem.slice(0, 4).map(({ r }) => (
              <div key={r.id} className="sd-row row">
                <div className="sd-row__grow"><b>{KIND[r.kind].e} {r.name}</b><br /><small>下次：{r.next}</small></div>
                <DueTag next={r.next as string} short />
              </div>
            )) : <div className="empty">暂无待办，健康状态良好 ✅</div>}
          </div>
          <div className="sd-card card"><h3>体重曲线<small><button className="x" data-add="weight" onClick={() => openRecord('weight')}>＋记录</button></small></h3><Chart /></div>
          <div className="sd-card card">
            <h3>疫苗 &amp; 驱虫</h3>
            {[...recsOf(s, pet.id, 'vaccine'), ...recsOf(s, pet.id, 'deworm')].sort((a, b) => b.date.localeCompare(a.date)).map(r => <RecRow key={r.id} r={r} />)}
            {!recsOf(s, pet.id, 'vaccine').length && !recsOf(s, pet.id, 'deworm').length && <div className="empty">还没有记录</div>}
          </div>
          <div className="sec">全部宠物总览</div>
          <Overview />
        </>
      )}
    </>
  );
}
