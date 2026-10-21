import { useState } from 'react';
import { useApp } from '../ctx';
import { careSummary, parseWeight } from '../product';
import { Chart } from './Chart';

/** One home for weight overview, chart and the two input methods. */
export function WeightPanel() {
  const { s, pet, openRecord } = useApp();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const { weights, delta } = careSummary(s, pet);
  const parse = () => {
    const result = parseWeight(text);
    if (!result) { setError('请按「今天体重4.8kg」填写；也支持昨天、YYYY-MM-DD 和斤。仅支持一条体重，请检查日期和单位。'); return; }
    setError(''); openRecord('weight', result.date, result.value);
  };
  return <section className="sd-card card companion" aria-labelledby="weight-title" data-weight-panel>
    <h3 id="weight-title">体重与趋势<button className="sd-btn sd-btn--default" data-add="weight" onClick={() => openRecord('weight')}>记体重</button></h3>
    <div className="sd-row"><div className="sd-row__grow">
      <b>{weights.length ? `最近体重 ${weights[0].value}kg（${weights[0].date}）` : '还没有体重记录，从第一次称重开始吧。'}</b>
      {delta !== null && <p>较上次{delta >= 0 ? '增加' : '减少'} {Math.abs(delta)}kg；这里只描述变化，不判断胖瘦。</p>}
    </div></div>
    <Chart />
    <details className="product-details" data-quick-weight>
      <summary>用一句话录入体重</summary>
      <p className="product-note">本地规则识别，未接入 AI 模型；识别后核对再保存。</p>
      <form onSubmit={e => { e.preventDefault(); parse(); }}>
        <label htmlFor="quick-weight">称重记录</label><input className="sd-input" id="quick-weight" value={text} onChange={e => setText(e.target.value)} placeholder="今天体重4.8kg" maxLength={80} required />
        <div className="product-actions"><button className="sd-btn sd-btn--primary">识别并核对</button></div>
      </form>
      {error && <p role="alert">{error}</p>}
    </details>
  </section>;
}
