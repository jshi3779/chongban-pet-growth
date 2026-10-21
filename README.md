# 宠伴 · 养宠成长记录与社区

React + Vite + TypeScript 移动端 Web 应用，数据存于浏览器 `localStorage`（`petgrowth.v1`）。

在线预览：https://jshi3779.github.io/chongban-pet-growth/（push 到 main 后由 GitHub Actions 构建并部署）

**已实现**：宠物档案（时间线 / 档案资料）· 体重曲线 · 疫苗/驱虫记录与到期提醒 · 日历打卡与连续天数 · 成长时间线 · 全部宠物总览
**预留入口**：附近宠友匹配、养宠广场、就医记录、用品商城

## 开发

```bash
npm install
npm run dev          # 本地开发
npm run build        # 类型检查 + 构建到 dist/
bash style-check.sh  # 样式硬编码检查
```

样式规则见 `AGENTS.md` 与 `style-baseline/STYLE-CONTRACT.md`。浏览器回归脚本：`tests/smoke.cjs`（需 Playwright，`npm run preview` 起服务后运行）。

示例照片来自 Unsplash，位于 `public/assets/`，仅作示意；项目暂未实现照片上传。

## 产品定位与本轮优化（2026-10-21）

宠伴面向新手、忙碌及多宠家庭，以免费成长记录与照护档案建立信任，再验证家庭协作、云备份、纪念册和 AI 辅助录入的会员价值。[完整产品分析、竞品依据、盈利假设和 AI 路线](docs/product-strategy.md)。

已支持：照护摘要、TXT档案导出、JSON备份留存、需核对的一句话体重录入、手工城市/区县与宠物类型筛选、地区自愿附加的本机日常、Plus本机意向标记。示例数据有标注；规则识别与本地摘要不冒充AI模型。

边界：社区帖子与点赞仅存本机；没有真实账号、云同步、备份恢复、GPS距离、聊天、支付、商家交易或大模型接口。提醒只在应用内展示，不会在关闭页面后主动推送。Plus价格是调研假设，不会扣费。

测试：`npm test` 运行逻辑测试；`npm run build` 进行类型检查与构建；`npm run check:style` 检查设计Token。另在预览服务运行后用Playwright执行 `node tests/smoke.cjs`（按原测试说明安装Playwright；可用 `BASE_URL` / `BROWSER_CHANNEL` 指定地址与浏览器）。
