# sintbot-site

**sintbot 平台**的展示 / 宣传网站。纯静态、单页、双语 EN/中。线上：https://sintbot.com

站的主角是 **多模型群聊机器人**（sintbot 守护进程）。另一条线 **桌宠**（趴桌面、**会说话、出声反应**、有性格的虚拟伙伴）**2026-09-14 起不再以首页卡片出现**——它的后续载体属于另一条产品线，不在本站叙事内；首页只在页脚留一句「桌宠研发中」（用户拍板）。它的口径仍是「研发中 · 尚未上线」，站上任何地方都不要写成已发布；若将来再上站，用「出声反应」口径（2026-07 定，见提交 `7b0feba` / `1f4df31`），勿往状态展示上写。

### ⚠ 支柱① 是双层的（2026-08-18 起）

| | 形态 | 归属 |
|---|---|---|
| **cc-bot** | **插件** —— 装进 Claude Code，活在交互会话里，绑死该会话的模型 | Free，MIT，公开仓 `WaterTian/cc-bot` |
| **sintbot** | **独立守护进程** —— 自带消息循环、无需人守终端，无头驱动 **Claude Code 与 Codex 两套 agent**，背后模型可换（Claude / GPT / GLM / DeepSeek / MiniMax / Kimi——2026-09-15 用户拍板站上用 Kimi 替下火山引擎） | **Pro 付费后交付**，私有仓，**飞书与 Slack 都支持**（每群二选一；站上写「都支持」，**不用「平级 / side by side」这类比较词**——用户 2026-09-15 定）；Discord 站上只写「计划中 / planned」——没有排期就不写版本承诺（2026-09-14 起，原「下一版支持」撤了） |

**命名铁律**：Pro 版守护进程在站上一律叫 **`sintbot`**（品牌大写 **`SintBot`**，2026-09-05 由 Sintbot 改定 —— 群里、控制台与飞书应用名都是 SintBot，站上再写 Sintbot 就成了同一个产品两个写法）。**内部代号与历史代号一律不上站**（含仓库名 `sbot` 及更早的部署代号）——对外只有 sintbot 这一个名字。本仓库是 Public，连本文件也算对外，写之前先想清楚。

**别把 sintbot 写成可公开下载** —— 它不是公开仓，交付走「订阅后邮件取件」。

**付款口径（2026-09-15 用户定）**：定价区只是保留支付通道，**Pro = 支持项目开发 + 可获取当前 sintbot 安装包，按现状提供**；站上、条款页、感谢页**不写任何服务承诺**（支持响应时间、接入引导、更新、新版本、早鸟都已删除，并明文写了「不承诺」）。⚠ **也不要写成「打赏 / donation / tip / 捐赠」**——Creem 禁售清单明文禁止「没有对应产品的捐赠」，必须始终有一个产品（安装包）在。导航不放「定价」，页脚保留。**站上写的每一句承诺都会被按字面读**，涉及付费、交付、退订的文案，写之前先确认对应通道真的存在；背景与判据见 `../sintbot-ops/business/creem/`。

## 技术栈

纯 **HTML / CSS / JS**，零构建工具、零依赖、零框架。单页应用（`index.html`）。

**字体（2026-09-14 定）**：只加载三个拉丁 webfont（Fraunces / Inter / JetBrains Mono），用 `preload` + `media="print"` onload 切 `all` 的**非阻塞**方式；**中文一律走系统字体**（苹方 / 雅黑，display 档先 Songti），栈顺序拉丁在前、中文在后（反过来拉丁字母会用中文字体里的字形），与守护进程 v0.11.64 同一条规矩。**不要再把 Noto SC 加回 Google Fonts 链接，也不要把字体 `<link>` 改回同步**——大陆访客连不上 googleapis，同步样式表会把首屏白屏拖到连接超时。

## 文件

- `index.html` — 页面结构。2026-09-04 改版后以 sintbot 为主角，区块顺序：hero → what → platforms（飞书 · Slack 都支持）→ flow（流程图）→ models → design → scenarios → governance（末尾一张「接管浏览器」卡，飞书限定——卡片只在飞书群发得出）→ console → ops → plugin（cc-bot 免费插件，安装步骤原样保留）→ pricing（淡化处理）→ cta。`<body>` 顶部内联一份 Lucide 图标 sprite（ISC，描边 1.5、24 网格、`currentColor`），页面上**不用 emoji**，状态一律用 sprite 图标或 CSS 圆点。
- `styles.css` — 全部样式，原生 CSS 自定义属性，PCB 电路板配色；字阶 token 64/40/24/21/17，文字四级透明度 .92/.56/.4/.1；**不加逐帧动画**（历史教训：描边流光与 WebGL 都因卡顿被撤；首页文字的滚动错层视差 2026-09-15 也撤了——用户：效果不好；**别再加任何滚动联动的位移**），过渡只允许 color / background-color / border-color / opacity
- `app.js` — 全部行为：i18n、滚动揭示、光标辉光、复制按钮、Umami 埋点；`?lang=en|zh` 可强制语言（截图与调试用）
- `assets/` — logo、`og-banner.png`（由 `og-banner.source.html` 渲染，改文案后重渲；走 DevTools 通道：emulate 1200×630×1、`document.fonts.ready` 后截 PNG——`chrome --headless --screenshot` 在 Chrome 152 已不出文件）、`design-styles.png`（守护进程自己渲染的 16 套内置风格预览，深色底；文案有变时用它的设计工具链重出）
- `robots.txt` / `sitemap.xml` — 2026-09-15 补；加新公开页时同步进 sitemap（`thanks.html` 为 noindex，不进）。首页 `<head>` 有一段 JSON-LD（SoftwareApplication），改首屏口径时同步它的 description；**不写价格、不写 sameAs**
- `CNAME` — GitHub Pages 自定义域名（`sintbot.com`），**勿删**

## 部署：push 即上线

仓库 `WaterTian/sintbot-site`。**push 到 `main` 分支 = GitHub Pages 自动部署**，几十秒生效。没有预发布环境 —— 改动前想清楚，push 后用 curl 或浏览器验证 https://sintbot.com。

本地预览：**只能用** `python3 -m http.server 8000`（资源与页面链接都是根路径 `/…`，直接双击打开 `index.html` 会丢样式）。

## 双语 i18n

- 文案**不要硬编码**在 HTML —— 用 `data-i18n` / `data-i18n-html` / `data-i18n-svg` 属性标记
- 所有字符串集中在 `app.js` 的 `translations` 对象，EN + 中文各一份
- 加新文案 = HTML 标属性 + `translations` 里补两种语言
- **两种语言各有地址**（2026-09-15）：`/` = 英文，`/zh/` = 中文。`zh/index.html` 是**生成物**：`node scripts/build-zh.mjs` 从 `index.html` 复制并按 `translations` 的 `meta.title / meta.description / meta.ogAlt` 写两边的 `<head>`（标题、描述、分享卡片、canonical、og:locale、中文分享图 `og-banner-zh.png`）。**改了 `index.html` 或 `meta.*` 就跑一次脚本**；预提交钩子 `.githooks/pre-commit` 会拦下不同步的提交（新克隆需 `git config core.hooksPath .githooks`）。别手改 `zh/index.html`、别手改 `index.html` 里那几个 meta。
- 语言规则在 `app.js`：`?lang=` 仅预览、不改地址不存偏好 → `/zh/` 固定中文 → 其余看已存偏好、再看浏览器语言；切换按钮原地换语言并用 `history.replaceState` 把地址换成对应路径（不刷新）。中文样式选择器用 `html:lang(zh)`（页面 lang 是 `zh-CN`）。
- 两张分享图：`og-banner.source.html` → `og-banner.png`，`og-banner-zh.source.html` → `og-banner-zh.png`，改文案后都要重渲。

## 注意事项

- 改样式 / 动效后**务必在 Windows Chrome 上验证** —— 本站踩过多个 Win11 专属的坑（光标辉光不跟随、触摸屏混合设备 pointer 误判）
- **首页标题与导语（2026-09-15 用户定）**：不点名飞书 / Slack，只说「群 / 聊天群」；导语要点名模型清单（ChatGPT、Claude、GLM、DeepSeek、Kimi、自己部署的开源模型）+ 群里随时切换 + 一套长期记忆本地维护。英文三行（Say it in the group. / Any model, one memory. / On your own machine.）各 ≤ 22 字符才不折行（18ch）。**中文标题是独立排版（`hero.titleEn` 的 zh 值），不是英文三行的翻译套版**：「双行夹注」——大字宋体写主张（「一群一项目」96px 宋体 Black 900，「模型随时换」降一级约 0.7× 用 Bold 700——两行不等大、不等重），紧跟一组 0.46 倍的两行金色小字作注（一句话 就开工 / 记忆 不丢），两行小字合起来正好一个大字高；第三级「全程在你自己的机器上」前加铜色短线。大字 `clamp(40px, 12.5vw, 96px)`，320 宽不溢出。改中文标题文案时，大字保持 5 字、夹注每行 ≤ 3 字，否则比例会散。
- 文案铁律：飞书与 Slack **同等篇幅**；不出现竞品名；不出现内部代号；定价与支付**不做视觉重点**（金额、Creem 链接、脚注原文不改）；每句能力描述都要对得上守护进程当前版本真有的功能
- 站点接了 **Umami** 统计（cloud.umami.is，script 标签在 `index.html` head）；改 `app.js` 时勿误删 section 6 的 `umami.track()` 事件埋点
- 项目记忆里有更多踩坑经验（光标辉光跨平台、导航 PCB 走线动效、域名配置等），动手前可查
- **公开仓库数据红线**：本仓库是 Public，任何提交全网可见，且历史一旦被抓取就无法真正
  撤回。运营/账号/业务文档（含任何个人邮箱、账号信息、后台状态）一律放平级私有仓库
  `../sintbot-ops/`，**永不 commit 到本仓库**；`.scratch/` 只放一次性草稿（已 gitignore）。
  git 提交身份用 noreply 邮箱（仓库级 git config 已设好）。

## 当前状态

`sintbot.com` 已完全上线，HTTPS 强制已开启（Let's Encrypt 证书 `CN=sintbot.com`，`http://` 自动 301 跳 HTTPS）。域名与部署链路无遗留待办。

唯一长期事项：Namecheap 域名自动续费已关闭，**2027-04 前需手动续费**。
