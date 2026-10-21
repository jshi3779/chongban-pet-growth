import { useState } from 'react';
import { useApp } from '../ctx';
import { careSummary, downloadText, healthText, parseWeight } from '../product';
import { today } from '../utils';

export function CareCompanion() {
  const { s, pet, openRecord, openPost, patch } = useApp();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const { week, weights, delta, due } = careSummary(s, pet);
  const parse = () => {
    const result = parseWeight(text);
    if (!result) { setError('请按「今天体重4.8kg」填写；也支持昨天、YYYY-MM-DD 和斤。仅支持一条体重，请检查日期和单位。'); return; }
    setError(''); openRecord('weight', result.date, result.value);
  };
  return <>
    <section className="sd-card card companion" aria-labelledby="care-title">
      <span className="sd-tag">照护小助手 · 本地整理</span>
      <h3 id="care-title">这周，一起好好长大</h3>
      <p className="product-note">按你录入的记录整理 · 初始档案含演示数据</p>
      <div className="sd-row"><div className="sd-row__grow"><b>近7天记录 {week.length} 条</b><p>{weights.length ? `最近体重 ${weights[0].value}kg（${weights[0].date}）` : '还没有体重记录，从第一次称重开始吧。'}</p>
      {delta !== null && <p>较上次{delta >= 0 ? '增加' : '减少'} {Math.abs(delta)}kg；这里只描述变化，不判断胖瘦。</p>}</div></div>
      <p>{due.length ? `${due.length} 项逾期或14天内到期，请核对提醒日期。` : '暂无已录入的近期到期事项；不代表已完成全部照护。'}</p>
      {due.slice(0, 3).map(x => <div className="sd-row" key={x.r.id}><span className="sd-row__grow">{x.r.name}</span><span>{x.r.next}</span></div>)}
      <div className="product-actions">
        <button className="sd-btn sd-btn--primary" data-act="export-health" onClick={() => downloadText(`宠伴-${pet.name}-照护档案.txt`, healthText(s, pet))}>导出照护档案</button>
        <button className="sd-btn sd-btn--default" onClick={() => openPost({ title: `${pet.name}的成长小记`, body: `这周和${pet.name}一起留下了${week.length}条成长记录。最想记住的小事是：\n` })}>写成长日常</button>
      </div>
      <details className="product-details"><summary>数据与隐私</summary><p>资料仅存当前浏览器，清理数据或换设备可能丢失。导出档案包含健康记录，请仅分享给可信照护者。下方备份包含全部宠物与本机帖子，可供留存；当前版本尚不支持恢复导入。</p><button className="sd-btn sd-btn--default" onClick={() => downloadText(`宠伴-本机备份-${today()}.json`, JSON.stringify(s, null, 2), 'application/json')}>下载本机备份</button></details>
    </section>
    <section className="sd-card card companion" aria-labelledby="quick-title">
      <h3 id="quick-title">一句话记体重</h3>
      <p className="product-note">本地规则识别，未接入 AI 模型；识别后核对再保存。</p>
      <form onSubmit={e => { e.preventDefault(); parse(); }}>
        <label htmlFor="quick-weight">称重记录</label><input className="sd-input" id="quick-weight" value={text} onChange={e => setText(e.target.value)} placeholder="今天体重4.8kg" maxLength={80} required />
        <div className="product-actions"><button className="sd-btn sd-btn--primary">识别并核对</button></div>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>
    <details className="sd-card card product-details">
      <summary>宠伴 Plus · 想要更多陪伴？</summary>
      <p>基础记录、提醒和档案导出持续免费。计划探索家庭协作、云备份、成长纪念册与 AI 辅助录入。</p>
      <p>拟定调研价 ¥19/月或 ¥128/年，尚未开通付费，也未提供云端或大模型服务。</p>
      <button className="sd-btn sd-btn--default" aria-pressed={s.memberInterest} onClick={() => patch({ memberInterest: !s.memberInterest })}>{s.memberInterest ? '已标记期待 · 点击取消' : '我感兴趣'}</button>
      <p className="product-note">仅在本机记录意向，不会扣费或提交联系方式。</p>
    </details>
  </>;
}
