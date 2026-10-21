import { WeightEntry } from './WeightEntry';
import { downloadText, healthText } from '../product';
import type { FormEvent } from 'react';
import { useApp } from '../ctx';
import { EMOJI, KIND, today } from '../utils';
import type { Kind } from '../types';

export type SheetState = { type: 'record'; kind: Kind; date: string; value?: string } | { type: 'archive' } | { type: 'pet' } | { type: 'post'; draft?: { title: string; body: string } } | { type: 'pick'; date: string } | { type: 'detail'; id: number } | null;
export type FormData2 = Record<string, string>;

const PICK: [Kind, string][] = [['vaccine', '接种记录与下次提醒'], ['deworm', '体内 / 体外驱虫']];

const LABEL: Record<Kind, [string, string]> = {
  weight: ['', ''],
  vaccine: ['疫苗名称', '如：猫三联'],
  deworm: ['驱虫类型', '如：体内驱虫'],
  milestone: ['标题', '如：第一次出门'],
};

export function Sheet({ sheet, onClose, onSubmit }: { sheet: SheetState; onClose: () => void; onSubmit: (d: FormData2) => void }) {
  const { s, pet, like, openRecord } = useApp();
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
      {sheet.type === 'archive' ? (
        <section className="panel" id="form" role="dialog" aria-modal="true" aria-label="档案导出与备份">
          <h4>档案导出与备份</h4>
          <p className="product-note">资料仅存当前浏览器，清理数据或换设备可能丢失。照护档案包含当前宠物的健康记录，请仅分享给可信照护者。JSON备份包含全部宠物与本机帖子，可供留存；当前版本尚不支持恢复导入。</p>
          <div className="product-actions"><button className="sd-btn sd-btn--primary" data-act="export-health" onClick={() => downloadText(`宠伴-${pet.name}-照护档案.txt`, healthText(s, pet))}>导出照护档案</button><button className="sd-btn sd-btn--default" data-act="export-backup" onClick={() => downloadText(`宠伴-本机备份-${today()}.json`, JSON.stringify(s, null, 2), 'application/json')}>下载本机备份</button></div>
          <div className="product-actions"><button className="sd-btn sd-btn--default" data-close onClick={onClose}>关闭</button></div>
        </section>
      ) : sheet.type === 'record' && sheet.kind === 'weight' ? (
        <WeightEntry key={`${s.cur}-${sheet.date}`} date={sheet.date} value={sheet.value} onClose={onClose} onSubmit={onSubmit} />
      ) : sheet.type === 'pick' ? (
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
            <div className="detail__meta"><span>{p.author} · {p.pet}</span><span>{p.mine ? '仅存本机' : '示例内容'}</span>{p.city && <span>📍 {p.city} {p.district}</span>}</div>
            <div className="act">
              <button type="button" className="sd-btn sd-btn--default" data-close onClick={onClose}>关闭</button>
              <button type="button" className={`sd-btn ${p.liked ? 'sd-btn--primary' : 'sd-btn--default'}`} data-like={p.id} onClick={() => like(p.id)}>{p.liked ? '♥' : '♡'} {p.likes}</button>
            </div>
          </article>
        );
      })() : sheet.type === 'post' ? (
        <form className="panel" id="form" onSubmit={submit}>
          <h4>发布帖子</h4>
          <p className="product-note">内容仅保存在本机，尚未连接真实社区。发布不会自动带上健康档案。</p>
          <label>标题<input className="sd-input" name="title" required pattern=".*\S.*" maxLength={30} defaultValue={sheet.draft?.title} placeholder="分享一件和宠物有关的事" /></label>
          <label>正文<textarea className="sd-input" name="body" rows={4} maxLength={300} defaultValue={sheet.draft?.body} placeholder="写点什么吧" /></label>
          <fieldset className="imgpick"><legend>配图（示例照片，上传功能待开发）</legend>
            {[['', '无'], ['cat.jpg', '猫'], ['dog.jpg', '狗'], ['cat-memory.jpg', '午后']].map(([v, n], i) => (
              <label key={v} className="imgpick__o"><input type="radio" name="img" value={v} defaultChecked={i === 0} />{v ? <img src={`${import.meta.env.BASE_URL}assets/${v}`} alt={n} /> : <span>无</span>}</label>
            ))}
          </fieldset>
          <input type="hidden" name="city" value={s.region.city} /><input type="hidden" name="district" value={s.region.district} />
          <label className="check"><input type="checkbox" name="nearby" disabled={!s.region.city} />附上所选地区{s.region.city ? `：${s.region.city} ${s.region.district}` : '（先在附近宠友设置城市）'}，不包含精确位置</label>
          {acts}
        </form>
      ) : sheet.type === 'record' ? (
        <form className="panel" id="form" onSubmit={submit} key={`${sheet.kind}${sheet.date}`}>
          <h4>{KIND[sheet.kind].e} 记录{KIND[sheet.kind].n}</h4>
          <label>日期<input className="sd-input" name="date" type="date" defaultValue={sheet.date} max={today()} required /></label>
          <label>{LABEL[sheet.kind][0]}<input className="sd-input" name="name" required placeholder={LABEL[sheet.kind][1]} /></label>
          {(sheet.kind === 'vaccine' || sheet.kind === 'deworm') && <label>下次到期日（可选）<input className="sd-input" name="next" type="date" /></label>}
          <label>备注<input className="sd-input" name="note" maxLength={60} /></label>
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
