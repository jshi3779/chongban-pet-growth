import { useApp } from '../ctx';
import { careSummary, downloadText, healthText } from '../product';
import { today } from '../utils';

export function CareCompanion() {
  const { s, pet, openPost, patch, go } = useApp();
  const { week, due } = careSummary(s, pet);
  return <>
    <section className="sd-card card companion" aria-labelledby="care-title">
      <span className="sd-tag">照护小助手 · 本地整理</span>
      <h3 id="care-title">这周，一起好好长大</h3>
      <p className="product-note">按你录入的记录整理 · 初始档案含演示数据</p>
      <b>近7天记录 {week.length} 条</b>
      <p>{due.length ? `${due.length} 项逾期或14天内到期，请核对提醒日期。` : '暂无已录入的近期到期事项；不代表已完成全部照护。'}</p>
      <button className="sd-btn sd-btn--primary" data-act="view-health" onClick={() => go('calendar')}>查看健康日历与记录</button>
      <div className="product-actions">
        <button className="sd-btn sd-btn--default" data-act="share-growth" onClick={() => openPost({ title: `${pet.name}的成长小记`, body: `这周和${pet.name}一起留下了${week.length}条成长记录。最想记住的小事是：\n` })}>晒日常</button>
        <button className="sd-btn sd-btn--default" data-act="find-nearby" onClick={() => { patch({ comm: 'nearby' }); go('community'); }}>附近宠友</button>
      </div>
      <details className="product-details"><summary>档案导出与备份</summary><p>资料仅存当前浏览器，清理数据或换设备可能丢失。照护档案包含当前宠物的健康记录，请仅分享给可信照护者。JSON备份包含全部宠物与本机帖子，可供留存；当前版本尚不支持恢复导入。</p>
        <div className="product-actions">
          <button className="sd-btn sd-btn--default" data-act="export-health" onClick={() => downloadText(`宠伴-${pet.name}-照护档案.txt`, healthText(s, pet))}>导出照护档案</button>
          <button className="sd-btn sd-btn--default" onClick={() => downloadText(`宠伴-本机备份-${today()}.json`, JSON.stringify(s, null, 2), 'application/json')}>下载本机备份</button>
        </div>
      </details>
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
