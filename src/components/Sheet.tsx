import type { FormEvent } from 'react';
import { useApp } from '../ctx';
import { EMOJI, KIND, today } from '../utils';
import type { Kind } from '../types';

export type SheetState = { type: 'record'; kind: Kind; date: string } | { type: 'pet' } | { type: 'post' } | { type: 'pick'; date: string } | { type: 'detail'; id: number } | null;
export type FormData2 = Record<string, string>;

const PICK: [Kind, string][] = [['vaccine', '接种记录与下次提醒'], ['deworm', '体内 / 体外驱虫']];

const LABEL: Record<Kind, [string, string]> = {
  weight: ['', ''],
  vaccine: ['疫苗名称', '如：猫三联'],
  deworm: ['驱虫类型', '如：体内驱虫'],
  milestone: ['标题', '如：第一次出门'],
};

export function Sheet({ sheet, onClose, onSubmit }: { sheet: SheetState; onClose: () => void; onSubmit: (d: FormData2) => void }) {
  const { s, like, openRecord } = useApp();
  if (!sheet) return null;
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(Object.fromEntries(new FormData(e.currentTarget)) as FormData2);
  };
  const acts = (
    <div className="act">
      <button type="button" className="sd-btn sd-btn--default" data-close onClick={onClose}>取消</button>
      <button className="sd-btn sd-btn--primary">保存</button>
    </div>
  );
  return (
    <div id="sheet" className="sheet">
      <div className="mask" onClick={onClose} />
      {sheet.type === 'pick' ? (
        <div className="panel pick" id="form" role="dialog" aria-label="添加事件">
          <h4>添加事件</h4>
          <p className="pick__date">日期：{sheet.date}</p>
          <div className="pick__grid">
            {PICK.map(([k, hint]) => (
              <button key={k} type="button" className="pick__opt" data-pick={k} onClick={() => openRecord(k, sheet.date)}>
                <i>{KIND[k].e}</i><b>{KIND[k].n}</b><small>{hint}</small>
              </button>
            ))}
          </div>
          <button type="button" className="sd-btn sd-btn--default pick__cancel" data-close onClick={onClose}>取消</button>
        </div>
      ) : sheet.type === 'detail' ? (() => {
        const p = s.posts.find(x => x.id === sheet.id);
        if (!p) return null;
        return (
          <article className="panel detail" id="form">
            {p.img && <img className="detail__img" src={`${import.meta.env.BASE_URL}assets/${p.img}`} alt={p.title} />}
            <h4>{p.title}</h4>
            <p className="detail__body">{p.body}</p>
            <div className="detail__meta"><span>{p.author} · {p.pet}</span>{p.km != null && <span>📍 {p.place} · {p.km} km</span>}</div>
            <div className="act">
              <button type="button" className="sd-btn sd-btn--default" data-close onClick={onClose}>关闭</button>
              <button type="button" className={`sd-btn ${p.liked ? 'sd-btn--primary' : 'sd-btn--default'}`} data-like={p.id} onClick={() => like(p.id)}>{p.liked ? '♥' : '♡'} {p.likes}</button>
            </div>
          </article>
        );
      })() : sheet.type === 'post' ? (
        <form className="panel" id="form" onSubmit={submit}>
          <h4>发布帖子</h4>
          <label>标题<input className="sd-input" name="title" required maxLength={30} placeholder="分享一件和宠物有关的事" /></label>
          <label>正文<textarea className="sd-input" name="body" rows={4} maxLength={300} placeholder="写点什么吧" /></label>
          <fieldset className="imgpick"><legend>配图（示例照片，上传功能待开发）</legend>
            {[['', '无'], ['cat.jpg', '猫'], ['dog.jpg', '狗'], ['cat-memory.jpg', '午后']].map(([v, n], i) => (
              <label key={v} className="imgpick__o"><input type="radio" name="img" value={v} defaultChecked={i === 0} />{v ? <img src={`${import.meta.env.BASE_URL}assets/${v}`} alt={n} /> : <span>无</span>}</label>
            ))}
          </fieldset>
          <label className="check"><input type="checkbox" name="nearby" />发布到「附近宠友」（显示我的位置）</label>
          {acts}
        </form>
      ) : sheet.type === 'record' ? (
        <form className="panel" id="form" onSubmit={submit} key={`${sheet.kind}${sheet.date}`}>
          <h4>{KIND[sheet.kind].e} 记录{KIND[sheet.kind].n}</h4>
          <label>日期<input className="sd-input" name="date" type="date" defaultValue={sheet.date} max={today()} required /></label>
          {sheet.kind === 'weight'
            ? <label>体重 (kg)<input className="sd-input" name="value" type="number" step="0.01" min="0.01" required /></label>
            : <label>{LABEL[sheet.kind][0]}<input className="sd-input" name="name" required placeholder={LABEL[sheet.kind][1]} /></label>}
          {(sheet.kind === 'vaccine' || sheet.kind === 'deworm') && <label>下次到期日（可选）<input className="sd-input" name="next" type="date" /></label>}
          {sheet.kind !== 'weight' && <label>备注<input className="sd-input" name="note" maxLength={60} /></label>}
          {acts}
        </form>
      ) : (
        <form className="panel" id="form" onSubmit={submit}>
          <h4>添加宠物</h4>
          <label>昵称<input className="sd-input" name="name" required maxLength={10} /></label>
          <label>种类<select className="sd-input" name="type">{Object.keys(EMOJI).map(t => <option key={t}>{t}</option>)}</select></label>
          <label>品种<input className="sd-input" name="breed" maxLength={12} /></label>
          <label>性别<select className="sd-input" name="gender"><option>♂</option><option>♀</option></select></label>
          <label>生日<input className="sd-input" name="birthday" type="date" max={today()} /></label>
          {acts}
        </form>
      )}
    </div>
  );
}
