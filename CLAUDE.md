# sintbot-site

**sintbot 平台**的展示 / 宣传网站。纯静态、单页、双语 EN/中。线上：https://sintbot.com

站的主角是 **多模型群聊机器人**（sintbot 守护进程）。另一条线 **桌宠**（趴桌面、**会说话、出声反应**、有性格的虚拟伙伴）**2026-09-14 起不再以首页卡片出现**——它的后续载体属于另一条产品线，不在本站叙事内；页脚原留的一句「桌宠研发中」2026-10-20 也去掉了（用户定），站上不再提桌宠。万一再提，口径仍是「研发中 · 尚未上线」，不要写成已发布；若将来再上站，用「出声反应」口径（2026-07 定，见提交 `7b0feba` / `1f4df31`），勿往状态展示上写。

### ⚠ 支柱① 是双层的（2026-08-18 起；2026-10 sintbot 公开后免费;cc-bot MIT,sintbot 1.0.5 起 PolyForm Shield）

| | 形态 | 归属 |
|---|---|---|
| **cc-bot** | **插件** —— 装进 Claude Code，活在交互会话里，绑死该会话的模型 | Free，MIT，公开仓 `WaterTian/cc-bot`；站上只在接入区末尾放一张「姊妹项目」小卡（2026-10-19 起：是什么 + 与 SintBot 的两行对比 + Claude Code 里的安装命令与仓库链接），不单开区块 |
| **sintbot** | **独立守护进程** —— 自带消息循环、无需人守终端，无头驱动 **Claude Code 与 Codex 两套 agent**，背后模型可换（Claude / GPT / GLM / DeepSeek / MiniMax / Kimi——2026-09-15 用户拍板站上用 Kimi 替下火山引擎） | **源码公开**(2026-10-23 起 PolyForm Shield 1.0.0:可自用 / 内部用 / 改了自用,禁止做竞品,收费免费都算;站上中文说「源码公开 / 完整源码公开,可查看和下载」,英文说「Public source / full source is public and downloadable」;不写「开源 / open source」,也不用 source-available;不主动提旧版本是 MIT)，公开仓 `sintlab/sintbot`，npm 包 `sintbot`，**飞书、Slack、企业微信都支持**（每群选一个平台；站上写「都支持」，**不用「平级 / side by side」这类比较词**——用户 2026-09-15 定）；企业微信 2026-10-19 用户定上站，平台区那栏带一句「三个平台里最新接入的，真实环境里用得最少，欢迎反馈」，真机验过后可去掉；平台、模型与 GitHub 的标志都是 SVG（见下「文件」里的品牌 sprite），只用来标明平台与模型，页脚有无隶属声明；Discord 不上站（2026-10-19 用户定：没有代码就不写「计划中」，开源后它会被当成承诺） |

**命名铁律**：守护进程在站上一律叫 **`sintbot`**（品牌大写 **`SintBot`**，2026-09-05 由 Sintbot 改定 —— 群里、控制台与飞书应用名都是 SintBot，站上再写 Sintbot 就成了同一个产品两个写法）。**内部代号与历史代号一律不上站**（含 `sbot` 及更早的部署代号）——对外只有 sintbot 这一个名字。npm 包同时装了 `sbot` 与 `sintbot` 两个命令，**站上的命令一律写 `sintbot`**（`sintbot setup` / `sintbot service install` …）。本仓库是 Public，连本文件也算对外，写之前先想清楚。

**作者身份铁律（2026-10-23 用户定）**：SintBot 的唯一作者是 **`WaterTian`**。任何 `author` / `creator` / `developer` / `maintainer` 字段只能写 `WaterTian`，不得出现第二人或组织；SintLab 只可作为 `publisher` / 项目工作室，不是作者。

**没有付费版（2026-10 起）**：sintbot 开源后 Pro 订阅停售、定价区与感谢页已删，Creem 商品下架。站上**不写价格、不放付款链接、不写「支持开发 / 打赏 / 赞助」**——要恢复任何收费形式，先想清楚交付的是什么产品（Creem 禁售「没有对应产品的付费」），背景见 `../sintbot-ops/business/creem/`。**站上写的每一句话都会被按字面读**：安装步骤、平台支持、系统支持都要和开源仓 README 当前版本一致（Mac 验证过；Linux 实验性；Windows 未验证）。权限口径照开源仓 `docs/security.md`：只有文件工具锁在项目目录里，命令行没有沙箱——**别写「agent 只能在项目目录里工作」**。

## 技术栈

纯 **HTML / CSS / JS**，零构建工具、零依赖、零框架。单页应用（`index.html`）。

**字体（2026-09-14 定）**：只加载三个拉丁 webfont（Fraunces / Inter / JetBrains Mono），用 `preload` + `media="print"` onload 切 `all` 的**非阻塞**方式；**中文一律走系统字体**（苹方 / 雅黑，display 档先 Songti），栈顺序拉丁在前、中文在后（反过来拉丁字母会用中文字体里的字形），与守护进程 v0.11.64 同一条规矩。**不要再把 Noto SC 加回 Google Fonts 链接，也不要把字体 `<link>` 改回同步**——大陆访客连不上 googleapis，同步样式表会把首屏白屏拖到连接超时。

## 文件

- `index.html` — 页面结构。2026-09-04 改版后以 sintbot 为主角，区块顺序：hero → what → platforms（飞书 · Slack · 企业微信都支持）→ flow（流程图）→ models → design → scenarios → governance（末尾一张「接管浏览器」卡，飞书限定——卡片只在飞书群发得出）→ console → ops → plugin（锚点沿用 `#plugin`，内容是 sintbot 的四步接入：npm 安装 → 建机器人 → `sintbot setup` → `sintbot service install`，末尾一张 cc-bot 姊妹项目卡）→ faq → cta。`<body>` 顶部内联一份 Lucide 图标 sprite（ISC，描边 1.5、24 网格、`currentColor`），页面上**不用 emoji**，状态一律用 sprite 图标或 CSS 圆点。紧跟着第二份 sprite 放**品牌标志**（`b-*`：三家平台、六个模型、Claude Code / Codex、GitHub，2026-10-19 起），**一律 SVG、不用 PNG**；来源与许可写在那份 sprite 的注释里（飞书 / 企微取自官网，其余取自 Lobe Icons MIT、SVG Logos 与 Simple Icons CC0）；那份 sprite 不能改成 `display:none`，否则符号里的渐变不显示。
- `styles.css` — 全部样式，原生 CSS 自定义属性，PCB 电路板配色；字阶 token 64/40/24/21/17，文字四级透明度 .92/.56/.4/.1；**不加逐帧动画**（历史教训：描边流光与 WebGL 都因卡顿被撤；首页文字的滚动错层视差 2026-09-15 也撤了——用户：效果不好；**别再加任何滚动联动的位移**），过渡只允许 color / background-color / border-color / opacity
- `app.js` — 全部行为：i18n、滚动揭示、光标辉光、复制按钮、Umami 埋点；`?lang=en|zh` 可强制语言（截图与调试用）。顶部 `VERSION` = npm 上 sintbot 的最新版（插件卡片与 JSON-LD `softwareVersion` 都读它），**发版后改这一行并跑 `node scripts/build-zh.mjs`**；`.github/workflows/version-check.yml` 每天跑 `scripts/check-version.mjs` 比对 npm，不一致就失败、GitHub 发邮件提醒（2026-10-20 起；此前 1.0.1 / 1.0.2 两次发版都漏改，站上一直写 v1.0.0）
- `assets/` — logo、`og-banner.png`（由 `og-banner.source.html` 渲染，改文案后重渲；走 DevTools 通道：emulate 1200×630×1、`document.fonts.ready` 后截 PNG——`chrome --headless --screenshot` 在 Chrome 152 已不出文件）（两个 `*.source.html` 不发布到线上，渲染时用本地预览打开）、`design-styles.png`（守护进程自己渲染的 16 套内置风格预览，深色底；文案有变时用它的设计工具链重出）
- `robots.txt` / `sitemap.xml` — 2026-09-15 补；加新公开页时同步进 sitemap。**lastmod 只在页面看得见的文字变了时改成当天**（只动脚本、样式、JSON-LD、统计代码不改）；预提交钩子跑 `scripts/check-lastmod.mjs` 守着这条，也拦「新页面没进 sitemap / sitemap 里的文件不存在」，特例用 `LASTMOD_SKIP=1 git commit` 跳过。JSON-LD 由脚本生成（见「双语 i18n」），**不写价格**；`publisher` 是 SintLab 工作室（sintlab.com，2026-10-20 加，与页脚「A SintLab project / SintLab 出品」链接互指，sintlab.com 首页也链回本站）；`sameAs` 只放与本站同一实体、公开可打开的页面（GitHub 仓库、npm 包；2026-10-20 开源后加上，cc-bot 是另一个项目不放）；`/llms.txt` 同为生成物
- `_config.yml` — GitHub Pages 用 Jekyll 构建，没有 front matter 的 `.md` 也会被渲染成网页（`CLAUDE.md` 曾挂在 `/CLAUDE.html`，2026-10-20 发现）。这里列出不发布的维护文件（`CLAUDE.md`、`README.md`、`scripts/`、分享图源文件）；**新增维护用文件记得加进去**，推送后用 curl 确认它 404
- `install.sh` — 一键安装脚本（`curl -fsSL https://sintbot.com/install.sh | bash`）。**是开源仓 `sintlab/sintbot` 根目录 `install.sh` 的副本**，改脚本先改开源仓，再原样拷过来；不在这里单独改
- `CNAME` — GitHub Pages 自定义域名（`sintbot.com`），**勿删**
- `google458994d25f5556b8.html` — Google Search Console 的站点验证文件（2026-10-20），**勿删**：删了验证会失效
- `783f94deea5dcec1f553933e980af9db.txt` — IndexNow 密钥文件（2026-10-20），**勿删**。改完站推送上线后跑 `node scripts/indexnow.mjs`，把 sitemap 里的网址推给 Bing 等搜索引擎重新抓取（不用登录站长后台）

## 部署：push 即上线

仓库 `WaterTian/sintbot-site`。**push 到 `main` 分支 = GitHub Pages 自动部署**，几十秒生效。没有预发布环境 —— 改动前想清楚，push 后用 curl 或浏览器验证 https://sintbot.com。

本地预览：**只能用** `python3 -m http.server 8000`（资源与页面链接都是根路径 `/…`，直接双击打开 `index.html` 会丢样式）。

## 双语 i18n

- 文案**不要硬编码**在 HTML —— 用 `data-i18n` / `data-i18n-html` / `data-i18n-svg` 属性标记
- 所有字符串集中在 `app.js` 的 `translations` 对象，EN + 中文各一份
- 加新文案 = HTML 标属性 + `translations` 里补两种语言
- **两种语言各有地址**（2026-09-15）：`/` = 英文，`/zh/` = 中文。**静态文字全部由 `node scripts/build-zh.mjs` 从 `translations` 生成**：两页的正文（`data-i18n*` 元素）、`<head>`（`meta.*` → 标题/描述/分享卡片/canonical/og:locale/分享图）、JSON-LD（SoftwareApplication + 由 `faq.*` 生成的 FAQPage）、以及 `/llms.txt`。原因：分享卡片和 AI 爬虫都不执行 JS。**改文案只改 `app.js`，然后跑一次脚本**；`index.html` 里 `data-i18n*` 元素的文字、那几个 meta、JSON-LD 和 `zh/index.html`、`llms.txt` 都别手改。预提交钩子 `.githooks/pre-commit` 会拦下不同步的提交，以及文字改了却没改 sitemap lastmod 的提交（新克隆需 `git config core.hooksPath .githooks`）。
- **只在中文页出现的块**（2026-10-19，如接入区「在中国大陆？」）：元素加 `zh-only` 类、`translations` 里英文值留空，英文页由 CSS 整块隐藏。站上对国内用户的口径：聊天平台推荐飞书；没有 Claude 订阅也没有 ChatGPT 时推荐 DeepSeek。
- **常见问题 `faq.*`**（GEO 用，2026-09-15）：每条回答必须是守护进程当前版本真有的事实，同时进页面、FAQPage 和 llms.txt；新增问题 = `app.js` 加 `faq.N.q/a` + `index.html` 加一行 `faq__item`。
- 语言规则在 `app.js`（2026-10-20 用户定**默认英文**）：`?lang=` 仅预览、不改地址不存偏好 → `/zh/` 固定中文 → 其余看已存偏好（只有访客亲手点过切换按钮才存，键 `sintbot_site_lang`）→ 否则英文，**不再按浏览器语言自动切中文**；切换按钮原地换语言并用 `history.replaceState` 把地址换成对应路径（不刷新）。中文样式选择器用 `html:lang(zh)`（页面 lang 是 `zh-CN`）。
- 两张分享图：`og-banner.source.html` → `og-banner.png`，`og-banner-zh.source.html` → `og-banner-zh.png`，改文案后都要重渲。

## 注意事项

- 改样式 / 动效后**务必在 Windows Chrome 上验证** —— 本站踩过多个 Win11 专属的坑（光标辉光不跟随、触摸屏混合设备 pointer 误判）
- **首页标题与导语（2026-09-15 用户定）**：不点名飞书 / Slack，只说「群 / 聊天群」；导语要点名模型清单（ChatGPT、Claude、GLM、DeepSeek、Kimi、自己部署的开源模型）+ 群里随时切换 + 一套长期记忆本地维护。英文三行（Say it in the group. / Any model, one memory. / On your own machine.）各 ≤ 22 字符才不折行（18ch）。**中文标题是独立排版（`hero.titleEn` 的 zh 值），不是英文三行的翻译套版**：「双行夹注」——大字宋体写主张（「一群一项目」96px 宋体 Black 900，「模型随时换」降一级约 0.7× 用 Bold 700——两行不等大、不等重），紧跟一组 0.46 倍的两行金色小字作注（一句话 就开工 / 记忆 不丢），两行小字合起来正好一个大字高；第三级「全程在你自己的机器上」前加铜色短线。大字 `clamp(40px, 12.5vw, 96px)`，320 宽不溢出。改中文标题文案时，大字保持 5 字、夹注每行 ≤ 3 字，否则比例会散。
- **英文页写「Feishu」，不写「Lark」**（2026-10-20 用户定）：守护进程只连飞书中国版（open.feishu.cn，SDK 默认域名），国际版 Lark（larksuite.com）是另一套开放平台、未支持；边界写在 FAQ 第 11 条。将来支持了 Lark 再改。
- 文案铁律：飞书与 Slack **同等篇幅**；不出现竞品名；不出现内部代号；每句能力描述都要对得上守护进程当前版本真有的功能
- 站点接了 **Umami** 统计（cloud.umami.is，script 标签在 `index.html` head）；改 `app.js` 时勿误删 section 6 的 `umami.track()` 事件埋点。**自己的访问别算进去**：任何浏览器（含 headless 验证用的）先打开一次 `https://sintbot.com/?notrack=1`，此后 Umami 不再统计它（`?notrack=0` 撤销）；Umami 统计面向的是外部访客，我们自测的流量曾占大头
- 项目记忆里有更多踩坑经验（光标辉光跨平台、导航 PCB 走线动效、域名配置等），动手前可查
- **公开仓库数据红线**：本仓库是 Public，任何提交全网可见，且历史一旦被抓取就无法真正
  撤回。运营/账号/业务文档（含任何个人邮箱、账号信息、后台状态）一律放平级私有仓库
  `../sintbot-ops/`，**永不 commit 到本仓库**；`.scratch/` 只放一次性草稿（已 gitignore）。
  git 提交身份用 noreply 邮箱（仓库级 git config 已设好）。

## 当前状态

`sintbot.com` 已完全上线，HTTPS 强制已开启（Let's Encrypt 证书 `CN=sintbot.com`，`http://` 自动 301 跳 HTTPS）。域名与部署链路无遗留待办。

唯一长期事项：Namecheap 域名自动续费已关闭，**2027-04 前需手动续费**。

待办（2026-09-15）：① ~~Google Search Console~~ 2026-10-20 已验证（URL 前缀资源 `https://sintbot.com/`，HTML 文件验证，见上「文件」）、sitemap 已提交、首页与 /zh/ 已请求重新编入索引；Bing Webmaster Tools 2026-10-20 已从 Search Console 导入（站点与 sitemap，同一账号），IndexNow 也已通知；② GEO 效果：等首页进了搜索索引（约 2026-11 下旬）再建固定题库基线（无品牌词的品类题 + 品牌题 + 纠偏题，每题新对话），没进索引前测 AI 没有信息量；方法见上级目录 `docs/ai-product-promotion-playbook.md`（不在本仓库）；③ ~~Kimi 预设~~ 2026-10-19 用户定：Kimi 在站上写成「控制台自定义添加」，预设验证后再改回。
