import type { FormEvent } from 'react';
import { EMOJI, KIND, today } from '../utils';
import type { Kind } from '../types';

export type SheetState = { type: 'record'; kind: Kind; date: string } | { type: 'pet' } | null;
export type FormData2 = Record<string, string>;

const LABEL: Record<Kind, [string, string]> = {
  weight: ['', ''],
  vaccine: ['疫苗名称', '如：猫三联'],
  deworm: ['驱虫类型', '如：体内驱虫'],
  milestone: ['标题', '如：第一次出门'],
};

export function Sheet({ sheet, onClose, onSubmit }: { sheet: SheetState; onClose: () => void; onSubmit: (d: FormData2) => void }) {
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
      {sheet.type === 'record' ? (
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
