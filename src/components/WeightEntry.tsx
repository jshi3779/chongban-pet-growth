import { useState } from 'react';
import { parseWeight } from '../product';
import { today } from '../utils';
import type { FormData2 } from './Sheet';

export function WeightEntry({ date: initialDate, value: initialValue, onClose, onSubmit }: { date: string; value?: string; onClose: () => void; onSubmit: (d: FormData2) => void }) {
  const [quick, setQuick] = useState(false);
  const [text, setText] = useState('');
  const [date, setDate] = useState(initialDate);
  const [value, setValue] = useState(initialValue || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const parse = () => {
    const result = parseWeight(text);
    setError(!result);
    if (!result) { setMessage('请按「今天体重4.8kg」填写；也支持昨天、YYYY-MM-DD 和斤。仅支持一条体重，请检查日期和单位。'); return; }
    setDate(result.date); setValue(result.value); setMessage('已填入下方日期和体重，请核对后保存。');
  };
  return <form className="panel" id="form" aria-label="记录体重" onSubmit={e => { e.preventDefault(); onSubmit({ date, value }); }}>
    <h4>⚖️ 记录体重</h4>
    <div className="region-filters" aria-label="体重录入方式">
      <button type="button" className={`chip ${!quick ? 'on' : ''}`} aria-pressed={!quick} onClick={() => setQuick(false)}>手动填写</button>
      <button type="button" className={`chip ${quick ? 'on' : ''}`} aria-pressed={quick} onClick={() => setQuick(true)}>一句话录入</button>
    </div>
    {quick && <div data-quick-weight>
      <p className="product-note">本地规则识别，未接入 AI 模型；识别后核对再保存。</p>
      <label htmlFor="quick-weight">称重记录<input className="sd-input" id="quick-weight" value={text} onChange={e => { setText(e.target.value); setMessage(''); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); parse(); } }} placeholder="今天体重4.8kg" maxLength={80} /></label>
      <button type="button" className="sd-btn sd-btn--default" onClick={parse}>识别并核对</button>
      {message && <p role={error ? 'alert' : 'status'}>{message}</p>}
    </div>}
    <label>日期<input className="sd-input" name="date" type="date" value={date} onChange={e => setDate(e.target.value)} max={today()} required /></label>
    <label>体重 (kg)<input className="sd-input" name="value" type="number" step="0.01" min="0.01" value={value} onChange={e => setValue(e.target.value)} required /></label>
    <div className="act"><button type="button" className="sd-btn sd-btn--default" data-close onClick={onClose}>取消</button><button className="sd-btn sd-btn--primary">保存</button></div>
  </form>;
}
