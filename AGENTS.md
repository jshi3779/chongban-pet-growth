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

## 当前设计（2026-10-21）

用户已明确要求参考11pets的UI重构，替代之前的POMU暖色黏土方案。当前使用白底、浅青信息区、灰色列表卡、洋红选中态导航、低阴影和小圆角。来源与范围见 docs/ui-11pets.md。

颜色和尺寸定义仍在 style-baseline/theme.css；tokens/base.json 与 manifest.json 同步更新。覆盖层为 src/styles/petcare.css，放在样式入口最后加载。禁止重新启用旧黏土内阴影和厚重手机外框。旧的 ui-ux-pro-max-design-system.md 仍未提供，不是当前实现依据。

保留四个现有页面、相册在宠物资料下方且紧邻体重卡、统一体重录入弹窗、导出图标、本地存储格式。Plus功能已按用户要求移除。

预览：https://jshi3779.github.io/chongban-pet-growth/

### 最新档案页覆盖（用户指定）

档案页根据用户提供的右侧屏幕采用蓝色宠物封面与叠层白卡，仅作用于data-page=home，覆盖层src/styles/profile.css置于入口最后；其他页面保持11pets参考视觉。新增profile色彩和字号Token必须在theme.css与tokens/base.json同步。猫封面使用从原本地示例照片提取透明背景的WebP，不冒充用户实际上传照片。宠物切换仅显示头像，通过aria-label/title保留姓名。
