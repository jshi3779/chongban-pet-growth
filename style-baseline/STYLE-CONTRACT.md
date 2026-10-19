# STYLE-CONTRACT · 宠物追踪 App（示例项目）

> 本文件是**给 AI 读的强制规则**。任何在本项目中生成或修改页面的动作，都必须先读本文件并遵守。
> 版本：1.0.0 · 更新：2026-10-19 · 基线包路径：`style-baseline/`

---

## 0. 一句话契约

**本项目的所有视觉样式，只能来自 `style-baseline/`，禁止任何形式的主观发挥。**

---

## 1. 加载顺序（生成页面前必须执行）

本基线为 C 端移动 App，模块归属以 `tokens/manifest.json` 为准。当前加载链：

```
tokens/base.json → tokens/frontend/frontend-base.json → tokens/frontend/app.json
```

合并后即 `theme.css` 的 `:root` 变量集合；页面统一 `@import "style-baseline/theme.css";`。

---

## 2. 四条硬规则

### 规则一 · 零硬编码
所有颜色、字号、行高、间距、圆角、阴影、动效时长，**必须**通过 CSS 变量引用：

```css
/* ✅ 正确 */
.card { background: var(--color-bg-card); padding: var(--space-lg); border-radius: var(--radius-xl); }

/* ❌ 禁止 */
.card { background: #fff; padding: 16px; border-radius: 20px; }
```

### 规则二 · 组件复用优先
优先使用 `theme.css` 中已定义的组件类（`.sd-btn` / `.sd-input` / `.sd-card` / `.sd-tag` / `.sd-tabbar` / `.sd-stat` / `.sd-row` …）。
需要新组件时，先检查能否由已有组件组合得出；确实需要新建的，必须复用已有 Token，并将新组件补写回 `components/`。

### 规则三 · 未覆盖即兜底 + 标注
若需要的样式在基线包中**没有**对应 Token：
1. 选取最接近的已有 Token 使用；
2. 在页面注释中标注：`⚠️ 未覆盖样式：{说明}，使用兜底 Token {token 名}`；
3. **禁止**虚构色值、字号、间距。

### 规则四 · 生成后自检
每次生成页面后，对产物执行以下检查并给出结论：

- [ ] 是否存在 Hex / px 硬编码？（应为 0）
- [ ] 是否所有颜色都来自 `--color-*`？
- [ ] 是否所有间距都来自 `--space-*`？
- [ ] 圆角、阴影是否来自 `--radius-*` / `--shadow-*`？
- [ ] 是否复用了 `theme.css` 中的既有组件？
- [ ] 未覆盖样式是否已标注？

任一检查不通过，必须修正后重新输出。

---

## 3. 差异与变更

- 发现基线包与页面实际需要冲突时，**不得就地修改**，应回到 `style-dna` 走「增量提取」流程更新基线包。
- 基线包版本变更后，须同步检查已生成页面是否需要回归。

---

## 4. 常用 Token 速查

| 用途 | 变量 |
|------|------|
| 品牌主色 | `var(--color-primary-500)` #3D7BFA |
| 主色浅底 | `var(--color-primary-50)` #EDF3FF |
| 主色深阶（按压） | `var(--color-primary-700)` #1F5CD9 |
| 成功/在线 | `var(--color-success)` #34C759 |
| 危险/紧急 | `var(--color-error)` #FF4D5C |
| 数据可视化紫 | `var(--color-violet)` #8B5CF6 |
| 正文文字 | `var(--color-text-primary)` #1A1D21 |
| 次要文字 | `var(--color-text-secondary)` #5B6168 |
| 三级文字 | `var(--color-text-tertiary)` #8A8F98 |
| 页面底色 | `var(--color-bg-page)` #F2F3F5 |
| 卡片底色 | `var(--color-bg-card)` #FFFFFF |
| 卡片间距 | `var(--space-lg)` 16px |
| 触控热区高度 | `var(--space-touch)` 44px |
| 主按钮高度 | `var(--space-touch-lg)` 48px |
| 卡片圆角 | `var(--radius-xl)` 20px |
| 胶囊圆角 | `var(--radius-full)` |
| 卡片阴影 | `var(--shadow-sm)` |
| 主按钮 | `class="sd-btn sd-btn--primary"` |
| 危险按钮 | `class="sd-btn sd-btn--danger"` |

> 完整清单见 `tokens/base.json` 与 `tokens/frontend/*.json`。
