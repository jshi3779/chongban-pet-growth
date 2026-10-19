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
