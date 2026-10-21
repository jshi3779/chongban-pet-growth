import { useApp } from '../ctx';
import { careSummary } from '../product';
import { Chart } from './Chart';

/** One home for weight overview, chart and the two input methods. */
export function WeightPanel() {
  const { s, pet, openRecord } = useApp();
  const { weights, delta } = careSummary(s, pet);
  return <section className="sd-card card companion" aria-labelledby="weight-title" data-weight-panel>
    <h3 id="weight-title">体重与趋势<button className="sd-btn sd-btn--default" data-add="weight" onClick={() => openRecord('weight')}>记体重</button></h3>
    <div className="sd-row"><div className="sd-row__grow">
      <b>{weights.length ? `最近体重 ${weights[0].value}kg（${weights[0].date}）` : '还没有体重记录，从第一次称重开始吧。'}</b>
      {delta !== null && <p>较上次{delta >= 0 ? '增加' : '减少'} {Math.abs(delta)}kg；这里只描述变化，不判断胖瘦。</p>}
    </div></div>
    <Chart />
  </section>;
}
