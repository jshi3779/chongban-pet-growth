import { useApp } from '../ctx';
import { careSummary } from '../product';

export function CareCompanion({ showActions = true }: { showActions?: boolean }) {
  const { s, pet, openPost, patch, go, openArchive } = useApp();
  const { week, due } = careSummary(s, pet);
  return <>
    <section className="sd-card card companion" aria-labelledby="care-title">
      <div className="card-tools"><span className="sd-tag">照护小助手 · 本地整理</span><button className="tool-icon" aria-label="档案导出与备份" title="档案导出与备份" onClick={openArchive}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 15v5h14v-5" /></svg></button></div>
      <h3 id="care-title">这周，一起好好长大</h3>
      <p className="product-note">按你录入的记录整理 · 初始档案含演示数据</p>
      <b>近7天记录 {week.length} 条</b>
      <p>{due.length ? `${due.length} 项逾期或14天内到期，请核对提醒日期。` : '暂无已录入的近期到期事项；不代表已完成全部照护。'}</p>
      {showActions && <><button className="sd-btn sd-btn--primary" data-act="view-health" onClick={() => go('calendar')}>查看健康日历与记录</button>
      <div className="product-actions">
        <button className="sd-btn sd-btn--default" data-act="share-growth" onClick={() => openPost({ title: `${pet.name}的成长小记`, body: `这周和${pet.name}一起留下了${week.length}条成长记录。最想记住的小事是：\n` })}>晒日常</button>
        <button className="sd-btn sd-btn--default" data-act="find-nearby" onClick={() => { patch({ comm: 'nearby' }); go('community'); }}>附近宠友</button>
      </div></>}
    </section>
  </>;
}
