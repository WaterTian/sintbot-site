# sintbot-site

**sintbot 平台**的展示 / 宣传网站。纯静态、单页、双语 EN/中。线上：https://sintbot.com

sintbot 含两根支柱：① **多模型群聊机器人**；② **桌宠** —— 趴桌面、**会说话、出声反应**、有性格的虚拟伙伴（注意口径：2026-07 起已从「演开发状态」改成「出声反应」，见提交 `7b0feba` / `1f4df31`，站上文案勿再往状态展示上写）。单页同时呈现这两部分。

### ⚠ 支柱① 是双层的（2026-08-18 起）

| | 形态 | 归属 |
|---|---|---|
| **cc-bot** | **插件** —— 装进 Claude Code，活在交互会话里，绑死该会话的模型 | Free，MIT，公开仓 `WaterTian/cc-bot` |
| **sintbot** | **独立守护进程** —— 自带消息循环、无需人守终端，无头驱动 **Claude Code 与 Codex 两套 agent**，背后模型可换（Claude / GPT / GLM / DeepSeek / MiniMax / 火山引擎） | **Pro 付费后交付**，私有仓，**飞书与 Slack 平级**（每群二选一）；Discord 站上只写「下一版支持」 |

**命名铁律**：Pro 版守护进程在站上一律叫 **`sintbot`**（品牌大写 **`SintBot`**，2026-09-05 由 Sintbot 改定 —— 群里、控制台与飞书应用名都是 SintBot，站上再写 Sintbot 就成了同一个产品两个写法）。**内部代号与历史代号一律不上站**（含仓库名 `sbot` 及更早的部署代号）——对外只有 sintbot 这一个名字。本仓库是 Public，连本文件也算对外，写之前先想清楚。

**别把 sintbot 写成可公开下载** —— 它不是公开仓，交付走「订阅后邮件取件」。**站上写的每一句承诺都会被按字面读**，涉及付费、交付、退订的文案，写之前先确认对应通道真的存在；背景与判据见 `../sintbot-ops/business/creem/`。

## 技术栈

纯 **HTML / CSS / JS**，零构建工具、零依赖、零框架。单页应用（`index.html`）。

## 文件

- `index.html` — 页面结构。2026-09-04 改版后以 sintbot 为主角，区块顺序：hero → what → platforms（飞书 · Slack 平级）→ flow（流程图）→ models → design → scenarios → governance → console → ops → plugin（cc-bot 免费插件，安装步骤原样保留）→ pricing（淡化处理）→ cta。`<body>` 顶部内联一份 Lucide 图标 sprite（ISC，描边 1.5、24 网格、`currentColor`），页面上**不用 emoji**，状态一律用 sprite 图标或 CSS 圆点。
- `styles.css` — 全部样式，原生 CSS 自定义属性，PCB 电路板配色；字阶 token 64/40/24/21/17，文字四级透明度 .92/.56/.4/.1；**不加逐帧动画**（历史教训：描边流光与 WebGL 都因卡顿被撤），过渡只允许 color / background-color / border-color / opacity
- `app.js` — 全部行为：i18n、滚动揭示、光标辉光、复制按钮、Umami 埋点；`?lang=en|zh` 可强制语言（截图与调试用）
- `assets/` — logo、`og-banner.png`（由 `og-banner.source.html` 用 headless Chrome 1200×630 渲染，改文案后重渲）、`design-styles.png`（守护进程自己渲染的 16 套内置风格预览，深色底；文案有变时用它的设计工具链重出）
- `CNAME` — GitHub Pages 自定义域名（`sintbot.com`），**勿删**

## 部署：push 即上线

仓库 `WaterTian/sintbot-site`。**push 到 `main` 分支 = GitHub Pages 自动部署**，几十秒生效。没有预发布环境 —— 改动前想清楚，push 后用 curl 或浏览器验证 https://sintbot.com。

本地预览：浏览器直接打开 `index.html`，或 `python -m http.server 8000`。

## 双语 i18n

- 文案**不要硬编码**在 HTML —— 用 `data-i18n` / `data-i18n-html` / `data-i18n-svg` 属性标记
- 所有字符串集中在 `app.js` 的 `translations` 对象，EN + 中文各一份
- 加新文案 = HTML 标属性 + `translations` 里补两种语言；语言偏好存 localStorage

## 注意事项

- 改样式 / 动效后**务必在 Windows Chrome 上验证** —— 本站踩过多个 Win11 专属的坑（光标辉光不跟随、触摸屏混合设备 pointer 误判）
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
