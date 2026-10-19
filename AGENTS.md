# AGENTS.md — 项目开发规则（给 AI 读）

## 项目

宠伴 App（养宠成长记录与社区）。移动端 Web 应用，React + Vite + TypeScript。

## 设计系统（强制，动手前必读）

本项目视觉样式已有固化基线，任何生成或修改页面/组件的动作，先读：

1. `style-baseline/STYLE-CONTRACT.md` — 四条硬规则与加载顺序
2. `ui-ux-pro-max-design-system.md` — 扁平卡通配色、字体与圆角/动效 Token（⚠️ 该文件尚未放入仓库，见「备注」）

## 硬约束

- 所有颜色、字号、间距、圆角、阴影、动效时长必须引用 CSS 变量：
  `var(--color-*)` / `var(--space-*)` / `var(--radius-*)` / `var(--shadow-*)` / `var(--motion-*)`。
  禁止硬编码 Hex 色值、px 间距。
- 组件优先复用 `style-baseline/theme.css` 中既有类：
  `.sd-btn`（含 `--primary/--danger` 变体）、`.sd-card`、`.sd-tag`、`.sd-tabbar`、`.sd-stat`、`.sd-row` 等。
- 样式入口统一 `@import "style-baseline/theme.css";`（见 `src/styles/index.css`）。
- React 组件的内联样式（`style={{...}}`）同样只允许引用变量或 `var(--*)`，不得写死色值。
- 未覆盖样式：选最接近的既有 Token 兜底，并在注释标注
  `⚠️ 未覆盖样式：{说明}，兜底 Token {token 名}`。

## 校验（生成后必跑）

```bash
bash style-check.sh      # 硬编码检查
npm run build            # 类型检查 + 构建
```

出现硬编码报错即视为不通过，须修正后重新输出。

## 备注

- 当前存在两套风格基线：`style-baseline/theme.css`（原追踪蓝 `#3D7BFA`）与
  `ui-ux-pro-max-design-system.md`（扁平卡通橙 `#FF7A59`）。落地新页面时，
  默认以 `ui-ux-pro-max-design-system.md` 的扁平卡通为准，并将对应色值同步进 `theme.css` 变量。
- 现状：`theme.css` 的主色色阶已切换为橙色（500 = `#FF7A59`，其余色阶由 500 推算）。
  `ui-ux-pro-max-design-system.md` 原文未提供，字体、圆角、动效 Token 尚未与它对齐，待补文件后校对。
- 在线预览：https://jshi3779.github.io/chongban-pet-growth/（GitHub Actions 构建并部署 `dist/`）。
