# 宠伴 · 养宠成长记录与社区

原生 HTML / CSS / JavaScript 移动端应用，无生产依赖或构建步骤。数据沿用 `localStorage` 的 `petgrowth.v1`，本次视觉更新无需迁移数据。

## 视觉

以宠物 App 参考图为方向，使用天空蓝、奶油白、浅粉色，以及柔光渐变、轻拟物按钮、大圆角档案卡、白边照片拼贴和悬浮胶囊导航。日历、时间线、社区预留入口、底部表单保持统一视觉，适配窄屏、桌面和减少动态效果偏好。

封面与相册使用仓库内的**示例照片**，界面有明确标注；不代表用户自己的宠物。原项目未实现照片上传，本次没有增加误导性的上传入口。社区、就医和商城仍为预留功能。

## 功能

宠物档案、体重曲线、疫苗 / 驱虫记录与到期提醒、日历打卡与连续天数、成长时间线、全部宠物总览。保留原有记录创建 / 删除、宠物切换及本地保存逻辑。

## 预览与验证

直接打开 `index.html` 或使用任意静态文件服务器。在线站点在 PR 合并前仍显示主分支版本。

- JavaScript 检查：`node --check app.js`
- 浏览器回归：先安装开发测试工具 `npm install --no-save playwright`，再执行 `npx playwright install chromium` 和 `node tests/smoke.cjs`。
- 如使用已安装的 Edge，PowerShell 中执行 `$env:BROWSER_CHANNEL='msedge'` 后运行测试。
- 测试使用独立浏览器上下文，不接触用户现有数据；验证创建 / 删除 / 刷新保存、多宠物切换、日历换月和打卡、时间线筛选、社区切换、图片加载、320 / 390 / 768 / 1440px 无页面横向溢出。
- 项目没有原有的 build、lint 或单元测试配置；语法检查与浏览器回归不能替代这些不存在的任务。

## 示例图片来源

照片来自 Unsplash，已下载到 `assets/`，运行时不请求图片外站：

- [猫咪封面](https://images.unsplash.com/photo-1573865526739-10659fec78a5)
- [狗狗照片](https://images.unsplash.com/photo-1552053831-71594a27632d)
- [猫咪回忆照片](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba)

字体沿用 Google Fonts 的 Manrope，无法联网时使用系统中文字体。
