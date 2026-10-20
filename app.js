// sintbot.com — vanilla JS for reveal-on-scroll, copy buttons,
// soft cursor glow, per-element reveal delays, and EN/zh-CN i18n.
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 0) i18n ----------------------------------------------------------------
  // Code blocks, command names and identifiers stay English in both modes.

  // sintbot version — single source of truth for the version shown in the setup
  // section. Mirror of the published npm package (WaterTian/sintbot package.json).
  // Bump this one line only; the setup section below interpolates it.
  const VERSION = "1.0.0";

  const translations = {
    // ---- <head> — the single source for title / description / share card.
    // scripts/build-zh.mjs writes these into index.html (en) and zh/index.html (zh);
    // unfurlers (Lark, WeChat, Slack) read only the static head, never this JS.
    "meta.title": {
      en: "SintBot — the group-project AI daemon, on your machine",
      zh: "SintBot —— 一群一项目，模型随时换，记忆不丢"
    },
    "meta.description": {
      en: `Bind a Lark, Slack or WeCom group to a project and anyone on the team can hand it work: SintBot reads and changes code, does design and reports back, on your own machine. Run ChatGPT, Claude, GLM, DeepSeek, Kimi or a model you host, switch in the group per task, and keep one long-term memory per project.`,
      zh: `一个飞书、Slack 或企业微信群绑一个项目，团队里谁都能派活：SintBot 在你自己的机器上读代码、改代码、做设计、出报告。ChatGPT、Claude、GLM、DeepSeek、Kimi 或自己部署的开源模型，群里按任务随时切换，项目只有一套长期记忆。`
    },
    "meta.ogAlt": {
      en: `SintBot — the group-project AI daemon for Lark, Slack and WeCom, running on your own machine`,
      zh: `SintBot —— 飞书、Slack 与企业微信的群项目 AI 守护进程，全程在你自己的机器上`
    },

    "nav.platforms":     { en: "Platforms",      zh: "平台" },
    "nav.models":        { en: "Models",         zh: "模型" },
    "nav.design":        { en: "Design",         zh: "设计" },
    "nav.console":       { en: "Console",        zh: "控制台" },
    "nav.setup":         { en: "Setup",          zh: "接入" },

    // ---- hero ------------------------------------------------------------
    "hero.eyebrow":      { en: `Open source · self-hosted · Lark, Slack & WeCom · Claude Code & Codex`,
                           zh: `开源 · 自托管 · 飞书 · Slack · 企业微信 · Claude Code & Codex` },
    "hero.titleEn": {
      en: `<span data-reveal data-reveal-delay="0">Say it in the group.</span>
           <em data-reveal data-reveal-delay="120">Any model, one memory.</em>
           <span data-reveal data-reveal-delay="240">On your own machine.</span>`,
      zh: `<span class="zh-row" data-reveal data-reveal-delay="0"><span class="zh-big">一群一项目</span><span class="visually-hidden">，</span><span class="zh-note"><span>一句话</span><span>就开工</span></span></span>
           <span class="zh-row" data-reveal data-reveal-delay="120"><span class="zh-big">模型随时换</span><span class="visually-hidden">，</span><span class="zh-note"><span>记忆</span><span>不丢</span></span></span>
           <span class="zh-tail" data-reveal data-reveal-delay="240">全程在你自己的机器上</span>`
    },
    "hero.lede": {
      en: `Bind a chat group to a project and anyone on the team can hand it work: <code>SintBot</code> reads and changes code, does design and reports back, on your own machine. ChatGPT, Claude, GLM, DeepSeek, Kimi or a model you host — switch in the group per task; one long-term memory per project, kept for you, stored locally.`,
      zh: `一个聊天群绑一个项目，团队里谁都能派活，<code>SintBot</code> 在你自己的机器上读代码、改代码、做设计、出报告。模型任选：ChatGPT、Claude，或 GLM、DeepSeek、Kimi、自己部署的开源模型，群里随时切换、不同任务用不同模型；项目的长期记忆只有一套，自动维护、留在本地。`
    },
    "hero.cta.primary": {
      en: "See how it works",
      zh: "看它怎么工作"
    },
    "hero.cta.plugin": {
      en: "Source on GitHub",
      zh: "GitHub 源码"
    },

    // ---- hero mockups ----------------------------------------------------
    "plat.lark":         { en: "Lark", zh: "飞书" },
    "mock.lark.title":   { en: "Design review",   zh: "设计评审" },
    "mock.lark.kind":    { en: "streaming card",  zh: "流式卡片" },
    "mock.lark.user":    { en: "Mei · Design",    zh: "小梅 · 设计" },
    "mock.lark.ask":     { en: "redo the homepage in the tech-dark style",
                           zh: "把首页按科技深色风格出一版" },
    "mock.lark.state":   { en: "Delivered · 4m 21s", zh: "已交付 · 4 分 21 秒" },
    "mock.lark.l1":      { en: "Read the style file · DESIGN.md", zh: "读取风格档 · DESIGN.md" },
    "mock.lark.l2":      { en: "Generated two versions · hero + pricing", zh: "生成两版 · 首屏 + 定价" },
    "mock.lark.l3":      { en: "Pre-delivery check · 0 mismatches", zh: "交付前核对 · 0 处不一致" },
    "mock.lark.b1":      { en: "Open preview",     zh: "打开预览" },
    "mock.lark.b2":      { en: "Edit per annotation", zh: "按标注改图" },
    "mock.eq":           { en: "same daemon",      zh: "同一个守护进程" },
    "mock.slack.working":{ en: "Working…",         zh: "Working…" },
    "mock.slack.user":   { en: "Lin · PM",         zh: "Lin · 产品" },
    "mock.slack.ask":    { en: "signup is throwing 500 on staging — look into it",
                           zh: "signup 在 staging 报 500，查一下" },
    "mock.slack.ack":    { en: "Got it — working in the thread", zh: "收到，线程里跟进" },
    "mock.slack.thread": { en: "Thread · 3 replies", zh: "线程 · 3 条回复" },
    "mock.slack.progress": { en: "Reading logs · 2/5", zh: "正在读日志 · 2/5" },
    "mock.slack.final":  {
      en: `Found it: <code>hashPassword</code> is missing an <code>await</code>. Opened <span class="mock__link">PR #482</span>.`,
      zh: `已定位：<code>hashPassword</code> 少了 <code>await</code>，已开 <span class="mock__link">PR #482</span>。`
    },
    "mock.slack.b1":     { en: "Stop",   zh: "停止" },
    "mock.slack.b2":     { en: "Status", zh: "状态" },

    // ---- what ------------------------------------------------------------
    "what.kicker":   { en: "What it is", zh: "它是什么" },
    "what.h":        { en: `One daemon. <em>Your project,</em> in the group.`, zh: `一个守护进程，<em>把项目</em>放进群里。` },
    "what.lede": {
      en: "SintBot runs on your machine and joins the groups your team already uses; each group is bound to one project, so the agent works inside that directory and keeps its context.",
      zh: "SintBot 跑在你自己的机器上，进的是团队本来就在用的群；一群绑一个项目，agent 在项目目录里干活、记得上下文。"
    },
    "what.bot.title":{ en: "Group-project AI", zh: "群项目 AI" },
    "what.bot.body": {
      en: `<code>sintbot</code> is the daemon: one project per group, each turn handed to Claude Code or Codex headless, progress in the group, permissions per group. Open source under MIT; <code>cc-bot</code> is the companion plugin for your own Claude Code session.`,
      zh: `<code>sintbot</code> 是守护进程：一群一项目，每一轮交给无头的 Claude Code 或 Codex，进度在群里、权限按群管。MIT 开源；<code>cc-bot</code> 是配套插件，装进你自己的 Claude Code 会话。`
    },
    "what.bot.link": { en: `See it on Lark, Slack and WeCom →`, zh: `看飞书、Slack 与企业微信里的样子 →` },

    "facts.platforms": { en: `platforms — Lark, Slack and WeCom`, zh: `个平台 —— 飞书、Slack 与企业微信` },
    "facts.runners":   { en: "agent runners — Claude Code and Codex", zh: "套 agent runner —— Claude Code 与 Codex" },
    "facts.models":    { en: "model backends, swappable per group", zh: "种模型后端，按群可换" },
    "facts.styles":    { en: "built-in design styles", zh: "套内置设计风格" },
    "facts.redact":    { en: "outbound redaction patterns", zh: "类出站脱敏模式" },
    "facts.tests":     { en: "unit tests", zh: "个单元测试" },

    // ---- platforms -------------------------------------------------------
    "plat.kicker": { en: "01 · Platforms", zh: "01 · 平台" },
    "plat.h":      { en: `Lark, Slack and WeCom, <em>all supported.</em>`, zh: `飞书、Slack 与企业微信，<em>都支持。</em>` },
    "plat.lede": {
      en: `A group can be a Lark group, a Slack channel or a WeCom group — each one picks, and one daemon serves all three. The core is the same everywhere: one project per group, just talk to it, no public IP, progress you can stop, the same permissions and console.`,
      zh: `群可以是飞书群、Slack 频道，也可以是企业微信群——每个群自己选，一个守护进程同时接三边。核心处处一样：一群一项目、群里直接说、免公网 IP、进度可见可停、同一套权限与控制台。`
    },
    "plat.lark.h":   { en: "In a Lark group", zh: "在飞书群里" },
    "plat.lark.1.t": { en: "Streaming card", zh: "流式卡片" },
    "plat.lark.1.b": {
      en: "The card updates while the work runs — how long, what it is doing now, a line per finished step; the answer and its buttons land in the same card, the steps folded away.",
      zh: "卡片边跑边更新：已跑多久、正在做什么、每完成一步多一行；做完正文和按钮落在同一张卡里，过程收进折叠区。"
    },
    "plat.lark.2.t": { en: "Whiteboard loop", zh: "画板闭环" },
    "plat.lark.2.b": {
      en: "Draw arrows or leave notes on the board, press “edit per annotation”, and the revised image returns to the same card.",
      zh: "在画板上画箭头、写便签，点「按标注改图」，改好的图回到同一张卡。"
    },
    "plat.lark.3.t": { en: "Nine group actions", zh: "群内九个动作" },
    "plat.lark.3.b": {
      en: "Send files, images and messages, read history, reply, edit, recall, download group files, react — and a reaction or card button can trigger it.",
      zh: "发文件、发图、发消息、读历史、回复、编辑、撤回、下载群文件、表情回应——点个表情、点卡片按钮也能触发它。"
    },
    "plat.lark.4.t": { en: "WebSocket long connection", zh: "WebSocket 长连接" },
    "plat.lark.4.b": {
      en: "The daemon dials out; nothing dials in. No public IP, no webhook.",
      zh: "只有守护进程往外连，没有东西往里连。不要公网 IP，不要 webhook。"
    },
    "plat.slack.h":   { en: "In a Slack channel", zh: "在 Slack 频道里" },
    "plat.slack.1.t": { en: "Progress in the thread", zh: "线程内进度" },
    "plat.slack.1.b": {
      en: "A receipt first, throttled progress messages in the thread, the final answer as its own message, then a done mark.",
      zh: "先回一条回执，线程里节流刷新进度，最终答案单独落地，最后打勾。"
    },
    "plat.slack.2.t": { en: "Native “Working…” status", zh: "原生 Working… 状态" },
    "plat.slack.2.b": {
      en: "Slack’s own agent status, on the free plan too; stop, skip and status buttons in the thread, plus an App Home page.",
      zh: "Slack 自己的 agent 状态条，免费版也有；线程里有停止 / 跳过 / 状态按钮，另有 App Home 主页。"
    },
    "plat.slack.3.t": { en: "Commands that survive Slack", zh: "命令不被 Slack 吃掉" },
    "plat.slack.3.b": {
      en: "When Slack has taken the slash, use a ! prefix or one catch-all command. The console’s Slack card runs a preflight, lists channels and binds a group.",
      zh: "斜杠被 Slack 占用时，用 ! 前缀或一条总入口命令。控制台的 Slack 卡负责预检、列频道、绑群。"
    },
    "plat.slack.4.t": { en: "Socket Mode, proxy-friendly", zh: "Socket Mode，可走代理" },
    "plat.slack.4.b": {
      en: "Outbound only, no public IP; on a restricted network it tunnels through an http proxy.",
      zh: "只出不进，免公网 IP；受限网络可走 http 代理隧道。"
    },
    "plat.wecom": { en: "WeCom", zh: "企业微信" },
    "plat.wecom.h": { en: "In a WeCom group", zh: "在企业微信群里" },
    "plat.wecom.note": { en: "The newest of the three and the least used in real teams so far — feedback welcome.", zh: "三个平台里最新接入的，真实环境里用得最少，欢迎反馈。" },
    "plat.wecom.1.t": { en: "Long connection, no verification", zh: "长连接，企业不用认证" },
    "plat.wecom.1.b": { en: "A smart bot in API mode on a long connection: no public IP, no domain, and a free unverified enterprise is enough.", zh: "智能机器人 · API 模式 · 长连接：不要公网、不要域名，免费注册、未认证的企业就能用。" },
    "plat.wecom.2.t": { en: "Answers when @-mentioned", zh: "@ 它就回" },
    "plat.wecom.2.b": { en: "WeCom delivers only messages that @ the bot. Small groups can turn on a follow-up window that answers without @; it is off by default.", zh: "企业微信只推送 @ 机器人的消息。小群可以打开「不 @ 也回复」的跟进窗口，默认关闭。" },
    "plat.wecom.3.t": { en: "Names, images and files", zh: "姓名、发图、发文件" },
    "plat.wecom.3.b": { en: "Authorize the official wecom-cli and the group shows members’ names and the bot can send images and files; without it, it still works with user IDs.", zh: "装好并授权官方命令行工具 wecom-cli，群里就显示成员姓名、机器人能发图发文件；不装也能用，只是显示账号。" },
    "plat.wecom.4.t": { en: "Streaming replies", zh: "流式回复" },
    "plat.wecom.4.b": { en: "Replies stream into the group; one longer than ten minutes carries on in the next message, and Markdown the client cannot show is rewritten.", zh: "回复在群里流式输出；超过 10 分钟的回复自动接成下一条，客户端显示不了的 Markdown 会自动改写。" },
    "plat.core.label": { en: "Shared core", zh: "共同内核" },
    "plat.core.1": { en: "one group, one project", zh: "一群一项目" },
    "plat.core.2": { en: "just talk to it", zh: "群里直接说" },
    "plat.core.3": { en: "no public IP", zh: "免公网 IP" },
    "plat.core.4": { en: "progress visible, stoppable", zh: "进度可见可停" },
    "plat.core.5": { en: "same permissions & redaction", zh: "同一套权限与脱敏" },
    "plat.core.6": { en: "one console", zh: "同一个控制台" },

    // ---- flow ------------------------------------------------------------
    "flow.kicker": { en: "02 · How it works", zh: "02 · 怎么跑" },
    "flow.h":      { en: `From <em>one sentence</em> to delivery.`, zh: `从<em>一句话</em>到交付。` },
    "flow.lede": {
      en: "The daemon on your machine checks the group’s permissions, hands the turn to Claude Code or Codex inside the project directory, and streams progress back — on whatever model you chose for that group.",
      zh: "你机器上的守护进程核对这个群的权限，把这一轮交给项目目录里的 Claude Code 或 Codex，进度回流到群——模型是你给这个群选的那一个。"
    },
    "flow.return":        { en: "progress + result back to the group", zh: "进度 + 结果回群" },
    "flow.col.group":     { en: "Group", zh: "群" },
    "flow.group.note1":   { en: "just talk to it", zh: "群里直接说" },
    "flow.group.note2":   { en: "one group · one project", zh: "一群 · 一项目" },
    "flow.col.daemon":    { en: "Daemon · your machine", zh: "守护进程 · 你的机器" },
    "flow.daemon.1":      { en: "message loop", zh: "消息循环" },
    "flow.daemon.2":      { en: "one group · one project", zh: "一群一项目" },
    "flow.daemon.3":      { en: "permissions · redaction", zh: "权限 · 脱敏" },
    "flow.daemon.note1":  { en: "long connection · no public IP", zh: "长连接 · 免公网 IP" },
    "flow.daemon.note2":  { en: "code and keys never leave", zh: "代码与密钥不出机器" },
    "flow.col.runner":    { en: "Agent runner", zh: "Agent runner" },
    "flow.runner.note1":  { en: "headless, in the project dir", zh: "无头，在项目目录里" },
    "flow.runner.note2":  { en: "long turns · stoppable", zh: "长任务 · 可停" },
    "flow.col.model":     { en: "Model", zh: "模型" },
    "flow.model.note1":   { en: "any Anthropic-compatible endpoint", zh: "任何 Anthropic 兼容端点" },
    "flow.model.note2":   { en: "your subscription or key", zh: "你自己的订阅或 key" },
    "flow.side.console":  { en: "console · local page", zh: "控制台 · 本地网页" },
    "flow.side.dir":      { en: "project directory · per group", zh: "项目目录 · 按群绑定" },
    "flow.side.design":   { en: "design toolchain", zh: "设计工具链" },
    "flow.side.design.note": { en: "style file · check · images · preview", zh: "风格档 · 核对 · 生图 · 预览" },
    "flow.caption": {
      en: "Left to right: group → daemon → runner → model. Dotted: progress and results return; the console, each group's project directory and the design toolchain hang off the daemon.",
      zh: "从左到右：群 → 守护进程 → runner → 模型。虚线：进度与结果回流；控制台、每个群的项目目录、设计工具链挂在守护进程旁。"
    },

    // ---- models ----------------------------------------------------------
    "models.kicker": { en: "03 · Models", zh: "03 · 模型" },
    "models.h":      { en: `Same agent. <em>Any brain.</em>`, zh: `同一套 agent，<em>任意大脑。</em>` },
    "models.lede": {
      en: "Claude Code against any Anthropic-compatible endpoint — GLM, DeepSeek, Kimi, MiniMax, or an open-source model you host yourself — or Codex through the machine’s own ChatGPT login. The daemon treats them all alike: switching only changes what the next turn starts with, and the project’s memory stays.",
      zh: "Claude Code 接任何 Anthropic 兼容端点——GLM、DeepSeek、Kimi、MiniMax，或你自己部署的开源模型；Codex 则用机器上的 ChatGPT 登录态。守护进程一视同仁：换模型只是换下一轮启动时带的参数，项目记忆不变。"
    },
    "models.p.claude":   { en: "local login, no key needed", zh: "本机登录态，不用配 key" },
    "models.p.gpt":      { en: "via your Codex subscription", zh: "走你的 Codex 订阅" },
    "models.p.glm":      { en: "your own key", zh: "你自己的 key" },
    "models.p.deepseek": { en: "your own key — our pick without a subscription", zh: "你自己的 key，没订阅时推荐" },
    "models.p.minimax":  { en: "your own key", zh: "你自己的 key" },
    "models.p.kimi":     { en: "add as a custom endpoint", zh: "控制台自定义添加" },
    "models.note": {
      en: "No Claude subscription or ChatGPT? Use DeepSeek: paste an API key and it runs. Zhipu GLM and MiniMax work the same way; Kimi and others can be added as custom endpoints.",
      zh: "没有 Claude 订阅也没有 ChatGPT？推荐 DeepSeek，填一个 API key 就能跑；智谱 GLM、MiniMax 同样可以，Kimi 等可以在控制台自定义添加。"
    },
    "models.1.title": { en: "Switch in the group", zh: "群里就能切" },
    "models.1.body": {
      en: `<code>/model</code> lists, <code>/model</code> plus a name switches — anyone in the group can. A switch opens a fresh conversation; the memory files carry over.`,
      zh: `<code>/model</code> 列出可用，<code>/model</code> 加名字就切，群里谁都能切。切换会开新对话，项目记忆文件带过去。`
    },
    "models.1.c2": { en: "fresh conversation", zh: "新对话" },
    "models.1.c3": { en: "anyone in the group", zh: "全员可切" },
    "models.2.title": { en: "Configured per group", zh: "按群配置" },
    "models.2.body": {
      en: "Each group has its own model and runner; provider settings stack, so chat can go to a fast model and heavy turns to a slow one.",
      zh: "每个群有自己的模型和 runner；provider 级设置可以叠加，闲聊走快模型、重活走慢模型。"
    },
    "models.2.c1": { en: "per group", zh: "按群" },
    "models.2.c2": { en: "fast / slow split", zh: "快慢分流" },
    "models.2.c3": { en: "your keys", zh: "你的 key" },
    "models.3.title": { en: "Memory outlives the model", zh: "记忆比模型活得久" },
    "models.3.body": {
      en: `The project’s <code>CLAUDE.md</code>, <code>AGENTS.md</code> and memory directory are handed to whichever agent starts. Text-only models work too: images become placeholder text.`,
      zh: `项目的 <code>CLAUDE.md</code>、<code>AGENTS.md</code> 和记忆目录，哪个 agent 启动都会拿到。纯文本模型也能用：图片换成占位文本。`
    },
    "models.3.c3": { en: "text-only safe", zh: "纯文本模型可用" },

    // ---- design ----------------------------------------------------------
    "dsn.kicker": { en: "04 · Design system", zh: "04 · 设计系统" },
    "dsn.h":      { en: `A design system the bot <em>actually follows.</em>`, zh: `机器人<em>真的遵守</em>的设计系统。` },
    "dsn.lede": {
      en: "Sixteen built-in styles, a style file that lives in the project, and a check that runs before anything is handed over.",
      zh: "16 套内置风格、一份放在项目里的风格档、一道交付前的核对。"
    },
    "dsn.img.alt": { en: "Sixteen built-in design styles rendered as miniature interface cards", zh: "16 套内置设计风格，渲染成微缩界面卡" },
    "dsn.img.cap": { en: "The 16 built-in styles, rendered by the daemon itself. The same preview cards appear in the console and in the group.",
                     zh: "16 套内置风格，守护进程自己渲染的。控制台和群里发的预览卡，用的是同一套。" },
    "dsn.1.title": { en: "A style file the agent must read", zh: "agent 必读的风格档" },
    "dsn.1.body": {
      en: `<code>DESIGN.md</code> in the project root — tokens, prose, do/don’t, image prompt — read before any image or page. Keep one per surface; share company rules via a user-level directory.`,
      zh: `项目根目录的 <code>DESIGN.md</code>：tokens、文字说明、Do/Don't、生图模板，出图出页面前必读。一个项目可有多份；公司规范放进用户级目录，所有群共用。`
    },
    "dsn.1.c1": { en: "16 built-in + 9 alternates", zh: "内置 16 套 + 备选 9 套" },
    "dsn.1.c2": { en: "extract from a reference image or URL", zh: "从参考图或网址提色" },
    "dsn.2.title": { en: "Checked before it is handed over", zh: "交付前先核对" },
    "dsn.2.body": {
      en: "Colours, radii, fonts, icon parameters, Chinese fallback and whether the font really renders on mac and Windows — pasted into the delivery note. A layout audit then measures overlaps, clipping, tap targets, contrast and tiny text at three widths.",
      zh: "对照风格档查颜色、圆角、字体、图标参数、中文兜底，以及字体在 mac 与 Windows 上是否真的显示——结果贴进交付说明。再按三档宽度真渲染，量重叠、裁切、点击目标、对比度、字号。"
    },
    "dsn.2.c1": { en: "style check", zh: "风格核对" },
    "dsn.2.c2": { en: "layout audit", zh: "渲染几何体检" },
    "dsn.2.c3": { en: "font availability", zh: "字体可得性" },
    "dsn.3.title": { en: "Images without a key", zh: "生图不用 key" },
    "dsn.3.body": {
      en: "Images borrow the machine’s Codex subscription — no API key, no group lock, and a progress message that updates itself while it paints. Edit on the original, repaint a masked region, transparent background; the style file rides along.",
      zh: "生图借机器上的 Codex 订阅：零 API key，不占群锁，画的时候群里有一条自己更新的进度。原图上改、遮罩局部重绘、透明底，项目风格档自动带上。"
    },
    "dsn.3.c1": { en: "edit in place", zh: "原图上改" },
    "dsn.3.c2": { en: "masked repaint", zh: "局部重绘" },
    "dsn.3.c3": { en: "transparent", zh: "透明底" },
    "dsn.4.title": { en: "Preview in the group", zh: "原型直接在群里看" },
    "dsn.4.body": {
      en: "A finished prototype is served on your local network on a port fixed per group; it survives across turns, stops after 30 idle minutes and can be stopped from the console.",
      zh: "做好的原型起成局域网服务，端口按群固定；跨轮存活，闲置 30 分钟自动停，控制台里可见可停。"
    },
    "dsn.4.c1": { en: "LAN preview", zh: "局域网预览" },
    "dsn.4.c2": { en: "fixed port per group", zh: "按群固定端口" },
    "dsn.4.c3": { en: "auto-stop", zh: "闲置自动停" },
    "dsn.board.h":    { en: "The whiteboard loop", zh: "画板闭环" },
    "dsn.board.only": { en: "only", zh: "限定" },
    "dsn.board.body": {
      en: "The first time it shows an image, the daemon creates a whiteboard and pins it as a group tab. Draw arrows, drop notes, comment; press “edit per annotation” and the result returns to the same card. Every version and mark is kept — the board becomes the design’s history. It holds design work only: things to look through go out as a searchable page, a choice as a numbered contact sheet.",
      zh: "第一次要展示图时，守护进程自动建画板并挂成群标签页。画箭头、贴便签、写评论，点「按标注改图」，结果回填同一张卡。历史版本与标注全部保留，画板就是这份设计的演变档案。画板只放设计方案：要翻找的做成可搜索的网页发群，要挑一个的出带序号的对照图。"
    },

    // ---- scenarios -------------------------------------------------------
    "scenarios.kicker": { en: "05 · Scenarios", zh: "05 · 场景" },
    "scenarios.h":      { en: `Six groups, <em>six jobs.</em>`, zh: `六个群，<em>六种活。</em>` },
    "scenarios.lede": {
      en: "The same daemon, bound to different projects: ask in the group, watch it work, take the result.",
      zh: "同一个守护进程，绑不同的项目：群里说一句，看着它干，拿走结果。"
    },
    "scenarios.1.title": { en: "Paste the error; a PR comes back.", zh: "报错贴进群，回来的是 PR。" },
    "scenarios.1.scene": { en: "A 500 trace lands in the engineering group.", zh: "研发群里贴了一段 500 堆栈。" },
    "scenarios.1.act": {
      en: "SintBot reads the trace, finds the cause in the project directory, fixes it, opens the PR and posts the diff in the thread.",
      zh: "SintBot 读堆栈、在项目目录里定位原因、改掉、开 PR，把 diff 贴回线程。"
    },
    "scenarios.1.win":   { en: `<i>Why it wins:</i> error, fix, PR — one thread, nobody at a terminal.`, zh: `<i>为什么赢：</i>报错、修复、PR 在同一条线程里，终端前不用有人。` },
    "scenarios.2.title": { en: "One sentence, one homepage.", zh: "一句话，要一版首页。" },
    "scenarios.2.scene": { en: "A designer asks for a first version of the landing page.", zh: "设计群里有人要落地页的第一版。" },
    "scenarios.2.act": {
      en: "It reads the style file — or first offers three candidates, say tech-dark, precision-mono and swiss-grid — builds the page and posts the check result with it.",
      zh: "它读项目风格档——没有就先给三个候选，比如科技深色、精密仪表、瑞士网格——出图做页面，核对结果随交付一起贴出来。"
    },
    "scenarios.2.win":   { en: `<i>Why it wins:</i> the rules are in the repo, and the bot proves it followed them.`, zh: `<i>为什么赢：</i>规范在仓库里，机器人还要证明自己照办了。` },
    "scenarios.3.title": { en: "A standup that files itself at 09:30.", zh: "每天 09:30，日报自己来。" },
    "scenarios.3.scene": { en: "Someone types one sentence to schedule it.", zh: "有人在群里一句话排了个定时任务。" },
    "scenarios.3.act": {
      en: "At 09:30 the task fires like an incoming message: SintBot collects 24 hours of commits and posts the summary.",
      zh: "到 09:30，任务像收到一条消息那样触发：SintBot 汇总 24 小时的提交，发到群里。"
    },
    "scenarios.3.win":   { en: `<i>Why it wins:</i> happens whether or not humans show up.`, zh: `<i>为什么赢：</i>人到不到，日报都在。` },
    "scenarios.4.title": { en: "Swap the brain mid-project.", zh: "项目做到一半，换个大脑。" },
    "scenarios.4.scene": { en: `Someone types <code>/model</code> and a name.`, zh: `有人在群里敲了 <code>/model</code> 加一个名字。` },
    "scenarios.4.act": {
      en: "Same project, same memory files — the next turn runs on GLM instead of Claude. Cost is your call, per group.",
      zh: "同一个项目、同一批记忆文件，下一轮从 Claude 换成 GLM 接着干。成本自己定，按群定。"
    },
    "scenarios.4.win":   { en: `<i>Why it wins:</i> one agent, many brains, no reconfiguration.`, zh: `<i>为什么赢：</i>一套 agent，多个大脑，不用重新配。` },
    "scenarios.5.title": { en: "Read-only here, full access there.", zh: "这个群只能看，那个群才能改。" },
    "scenarios.5.scene": { en: "Two groups are bound to the same project.", zh: "两个群绑了同一个项目。" },
    "scenarios.5.act": {
      en: "The read-only group can look, not touch; only the full-access group changes code and deploys. Secrets are masked before anything leaves.",
      zh: "只读群能看不能动；完全访问群才能改代码、部署。敏感值出群前先打码。"
    },
    "scenarios.5.win":   { en: `<i>Why it wins:</i> permissions live on the group, not in someone’s head.`, zh: `<i>为什么赢：</i>权限挂在群上，不靠人记。` },
    "scenarios.6.title": { en: "Review the prototype without leaving the group.", zh: "原型不出群就能评。" },
    "scenarios.6.scene": { en: "The page is done; the team wants to click through it.", zh: "页面做完了，团队想点开看看。" },
    "scenarios.6.act": {
      en: `SintBot serves it on the local network and posts the link; <code>/issue</code> files feedback with the last turn’s technical fingerprint attached.`,
      zh: `SintBot 起成局域网预览，链接发群；<code>/issue</code> 一句话提反馈，上一轮的技术指纹自动附上。`
    },
    "scenarios.6.win":   { en: `<i>Why it wins:</i> feedback lands with context, not screenshots.`, zh: `<i>为什么赢：</i>反馈带着上下文来，不是一张截图。` },

    // ---- governance ------------------------------------------------------
    "gov.kicker": { en: "06 · Governance", zh: "06 · 治理" },
    "gov.h":      { en: `Read-only <em>until you say otherwise.</em>`, zh: `<em>默认只读，</em>你说了才能动。` },
    "gov.lede": {
      en: "Three layers, all set per group and never globally — a group you have not configured can read and nothing else.",
      zh: "三层权限，全部按群设、没有全局开关——没配置过的群，只能读。"
    },
    "gov.t1.title": { en: "Execution mode", zh: "执行模式" },
    "gov.t1.body":  { en: "Read-only or full access. Unset means read-only.", zh: "只读，或完全访问。没设就是只读。" },
    "gov.t2.title": { en: "Tool allow / deny list", zh: "工具白名单 / 黑名单" },
    "gov.t2.body":  { en: "Three presets — read-only, developer, full trust — or your own list.", zh: "三档预设：只读、开发、全信任；也可以自己列。" },
    "gov.t3.title": { en: "Directory fence", zh: "目录围栏" },
    "gov.t3.body":  { en: "File tools stay inside the group's project directory, and groups bind only inside your projects root — symlinks included. Shell commands aren't sandboxed; for OS-level isolation, run it as its own user or in a VM.", zh: "文件工具只在本群绑定的项目目录里动，能绑的目录只限项目根目录之内，符号链接绕不出去。命令行没有沙箱；要系统级隔离，请用单独的系统用户或虚拟机跑。" },
    "gov.1.title": { en: "Redacted on the way out", zh: "出站先脱敏" },
    "gov.1.body": {
      en: "Thirteen patterns are masked before a message reaches the group — bearer tokens, JWTs, API-key prefixes, AWS, GitHub, PEM, key-value secrets, emails, phones. Secrets always; PII per group.",
      zh: "消息到群之前先过 13 类模式：Bearer、JWT、API key 前缀、AWS、GitHub、PEM、键值对、邮箱、手机号。密钥永远遮，PII 按群开关。"
    },
    "gov.1.c1": { en: "13 patterns", zh: "13 类模式" },
    "gov.1.c2": { en: "secrets always", zh: "密钥永远遮" },
    "gov.1.c3": { en: "PII per group", zh: "PII 按群" },
    "gov.2.title": { en: "Eight commands, in the group", zh: "群里八条命令" },
    "gov.2.body": {
      en: `<code>/status</code> reports elapsed time, steps, latest activity, queue and session; <code>/hud</code> shows quota. The group is warned when the Claude 5-hour window passes 90% or the Codex 7-day window passes 95%.`,
      zh: `<code>/status</code> 报已跑时长、步数、最近动静、排队、会话；<code>/hud</code> 报额度。Claude 5 小时窗用过 90%、Codex 7 天窗用过 95%，群里会提醒。`
    },
    "gov.3.title": { en: "Quiet when it should be", zh: "该安静时安静" },
    "gov.3.body": {
      en: `Pause a group and nothing runs, scheduled tasks included. Small talk gets no reply; a recalled message stops its turn. <code>/issue</code> files feedback with the last turn’s fingerprint attached.`,
      zh: `群一暂停就什么都不跑，定时任务也停。闲聊不回；消息撤回，那一轮就停。<code>/issue</code> 提反馈，自动附上一轮的技术指纹。`
    },
    "gov.3.c1": { en: "pause a group", zh: "群可暂停" },
    "gov.3.c2": { en: "recall stops the turn", zh: "撤回即停" },
    "gov.3.c3": { en: "feedback book", zh: "反馈本" },
    "gov.takeover.h": { en: "Browser takeover", zh: "接管浏览器" },
    "gov.takeover.body": {
      en: "When a job in its browser hits a login, a verification code, a slider or a QR code, it posts a card: a screenshot of that page, why it needs you, one button. Tap it and work the page yourself from your phone or desk — tap, drag, type, pinch to zoom; the login stays on its side and it carries on. The link opens once, lasts 10 minutes by default and reaches only that page, and the card flips to in use, ended or expired. Nobody pastes a password or a code into the group.",
      zh: "它用浏览器干活时撞上登录、验证码、滑块或扫码，会往群里发一张卡：卡住那一页的截图、为什么要你、一个按钮。点开就在手机或电脑上亲手操作那一页——点、拖、输入、两指缩放；登录态留在它那边，它接着干。链接只能打开一次、默认 10 分钟内有效、只通向那一页，卡片会翻成「接管中」「已结束」「已过期」。密码和验证码不用再往群里发。"
    },

    // ---- console ---------------------------------------------------------
    "con.kicker": { en: "07 · Console", zh: "07 · 控制台" },
    "con.h":      { en: `One local page for <em>every group.</em>`, zh: `一个本地网页，<em>管所有群。</em>` },
    "con.lede": {
      en: "The daemon serves its own console — a single page with no dependencies, on this machine only until you open it: to the LAN behind a password, or on your own HTTPS domain, where only the admins you listed sign in with Lark.",
      zh: "守护进程自己提供控制台——零依赖的单页网页，默认只在本机；要开出去，局域网靠密码，挂到你自己的 HTTPS 域名上则只放行名单里的管理员用飞书登录。"
    },
    "con.tab.overview": { en: "Overview", zh: "概览" },
    "con.tab.groups":   { en: "Groups · Projects", zh: "群 · 项目" },
    "con.tab.models":   { en: "Models · Library", zh: "模型 · 库" },
    "con.tab.settings": { en: "Settings", zh: "设置" },
    "con.groups.more":  { en: "+ new group", zh: "+ 新建群" },
    "con.f.perm":    { en: "Permissions", zh: "权限" },
    "con.v.perm":    { en: "full access · developer preset", zh: "完全访问 · 开发档" },
    "con.f.model":   { en: "Model", zh: "模型" },
    "con.v.model":   { en: "Claude Code", zh: "Claude Code" },
    "con.f.style":   { en: "Style file", zh: "风格档" },
    "con.v.style":   { en: "tech dark", zh: "科技深色" },
    "con.f.preview": { en: "Preview", zh: "预览" },
    "con.v.preview": { en: "on · :4610", zh: "运行中 · :4610" },
    "con.f.last":    { en: "Last turn", zh: "最近一轮" },
    "con.v.last":    { en: "signup 500 → PR #482 · 6m 12s", zh: "signup 500 → PR #482 · 6 分 12 秒" },
    "con.a.stop":    { en: "Stop", zh: "停止" },
    "con.a.new":     { en: "New session", zh: "新会话" },
    "con.a.say":     { en: "Interject", zh: "插话" },
    "con.stream":    { en: "Live activity", zh: "实时活动" },
    "con.stream.1":  { en: "10:42 · reading src/auth/hash.js", zh: "10:42 · 读取 src/auth/hash.js" },
    "con.stream.2":  { en: "10:43 · running tests · 118 passed", zh: "10:43 · 跑测试 · 118 通过" },
    "con.p1.t": { en: "Groups and projects", zh: "群与项目" },
    "con.p1.b": {
      en: `Create or dissolve a group, bind its project directory, link the repo, pause it; Lark, Slack and WeCom cards with a preflight.`,
      zh: `建群、解散群，绑项目目录，关联仓库，暂停群；飞书 / Slack / 企业微信接入卡先预检。`
    },
    "con.p2.t": { en: "Models and permissions", zh: "模型与权限" },
    "con.p2.b": {
      en: "Per group: model, execution mode, permission preset, PII switch, MCP plugins. Quota used, with Claude and Codex login checks.",
      zh: "按群：模型、执行模式、权限预设、PII 开关、MCP 插件。额度已用，Claude / Codex 登录验证。"
    },
    "con.p3.t": { en: "Design library", zh: "设计库" },
    "con.p3.b": {
      en: "The style library as a preview grid, a form for a new style file, ingest from a project, the icon library.",
      zh: "风格库预览网格、表单新建风格档、从项目收录、图标库。"
    },
    "con.p4.t": { en: "Operations", zh: "运维" },
    "con.p4.b": {
      en: "Live activity stream, scheduled tasks, running previews, feedback book, version history; per group stop, new session, interject. In English or Chinese.",
      zh: "实时活动流、定时任务、运行中的预览、反馈本、版本历史；每群一键停止、新会话、插话。界面中英文可切。"
    },

    // ---- ops -------------------------------------------------------------
    "ops.kicker": { en: "08 · Reliability", zh: "08 · 长跑可靠" },
    "ops.h":      { en: `Built to run <em>for weeks.</em>`, zh: `为<em>连跑几周</em>而写。` },
    "ops.lede": {
      en: "A daemon nobody watches has to look after itself: turns cannot hang, queues cannot pile up, restarts lose nothing.",
      zh: "没人盯着的守护进程得自己照顾自己：轮次不挂死，队列不堆积，重启不丢活。"
    },
    "ops.1.title": { en: "Never hangs", zh: "永不挂死" },
    "ops.1.body": {
      en: "A 30-minute cap per turn, two turns at once across groups, “received” after 25 silent seconds, a hard release at 20; sessions compact at 400k tokens and a watchdog reconnects.",
      zh: "每轮 30 分钟上限，全局同时两轮；25 秒没输出先回「已收到」，卡住 20 秒硬释放；40 万 token 自动压缩，看门狗自动重连。"
    },
    "ops.1.c1": { en: "30-min cap", zh: "30 分钟上限" },
    "ops.1.c2": { en: "watchdog", zh: "看门狗" },
    "ops.1.c3": { en: "auto-compaction", zh: "自动压缩" },
    "ops.2.title": { en: "One queue per group, merged", zh: "每群一条队列，出队合并" },
    "ops.2.body": {
      en: `One lock and one queue per group; messages that arrive mid-turn are merged into the next turn. <code>/stop</code> clears the queue, <code>/skip</code> only the current turn.`,
      zh: `每群一把锁、一条队列；跑着时来的消息，出队时合并成一轮。<code>/stop</code> 全停含排队，<code>/skip</code> 只跳当前。`
    },
    "ops.2.c1": { en: "one lock per group", zh: "每群一把锁" },
    "ops.2.c2": { en: "merge on dequeue", zh: "出队合并" },
    "ops.3.title": { en: "Restarts redo, not forget", zh: "重启补做，不丢活" },
    "ops.3.body": {
      en: "A turn cut short by a release or restart is redone automatically within two hours. Runs as a service: launchd on macOS, systemd on Linux (experimental); on Windows it prints the NSSM or pm2 command.",
      zh: "被发版或重启打断的那一轮，两小时内自动重做。常驻：macOS 用 launchd，Linux 用 systemd（实验性），Windows 给出 NSSM 或 pm2 的现成命令。"
    },
    "ops.3.c1": { en: "redo within 2h", zh: "2 小时内补做" },
    "ops.4.title": { en: "Scheduled in one sentence", zh: "一句话排定时任务" },
    "ops.4.body": {
      en: "Cron, aliases like daily, or plain “every day at 09:00”. A task can wake the agent like a message, post a fixed reminder, or run once.",
      zh: "cron、daily 别名，或直接写「每天 09:00」。到点可以像收到消息一样叫醒 agent，也可以只发提醒，或只跑一次。"
    },
    "ops.4.c2": { en: "natural language", zh: "中文简写" },
    "ops.4.c3": { en: "one-off", zh: "一次性" },
    "ops.5.title": { en: "Says what is going on", zh: "有事说人话" },
    "ops.5.body": {
      en: "After an upgrade it posts the new abilities to each group. If the model is overloaded it says so plainly, keeps what it had written and carries on when you say “continue”; a compacted session is announced, with the quota left when the model reports one.",
      zh: "升级后把新能力发到各个群。模型那边排不上队时说句人话，已经写出来的保住，过一会儿发一句「继续」就接着做；长会话自动压缩会告诉群，查得到额度就一并报上。"
    },
    "ops.5.c1": { en: "upgrade broadcast", zh: "升级播报" },
    "ops.5.c2": { en: "plain-language errors", zh: "出错说人话" },
    "ops.5.c3": { en: "compaction notice", zh: "压缩提示" },
    "ops.6.title": { en: "Small footprint, smart egress", zh: "依赖少，出网会分流" },
    "ops.6.body": {
      en: "Node 22+ with two runtime dependencies; Claude Code and Codex are separate installs the setup wizard can do for you. Official Claude goes through your proxy, domestic endpoints connect direct.",
      zh: "Node 22 起，运行时依赖两个；Claude Code 和 Codex 另装，配置向导可以代你装。官方 Claude 走代理，国内端点直连，自动分流。"
    },
    "ops.6.c2": { en: "2 runtime deps", zh: "2 个运行时依赖" },
    "ops.6.c3": { en: "auto proxy split", zh: "代理自动分流" },

    // ---- setup (open-source daemon from npm) ------------------------------
    // The command shown on the site is the `sintbot` alias (the package also installs a shorter
    // command; the site uses only the product name). Every step must match the daemon's README.
    "plugin.kicker": { en: "09 · Setup", zh: "09 · 接入" },
    "plugin.h":      { en: `<em>Open source</em> — up and running in minutes.`, zh: `<em>开源</em>，几分钟跑起来。` },
    "plugin.lede": {
      en: `<code>sintbot</code> is MIT-licensed and installs from npm. The machine that runs it needs Node 22 or later and <code>claude</code> (Claude Code) — the setup wizard installs it if it is missing; log in only if you use Claude itself. Add <code>codex</code> if you want GPT groups.`,
      zh: `<code>sintbot</code> 采用 MIT 许可，从 npm 安装。跑它的机器需要 Node 22 及以上和 <code>claude</code>（Claude Code）——没装的话配置向导会替你装；只有用 Claude 本身才需要登录。要开 GPT 群再加 <code>codex</code>。`
    },
    "plugin.meta.kind": { en: `npm · sintbot v${VERSION}`, zh: `npm · sintbot v${VERSION}` },

    "install.h":      { en: "From npm to your group in four steps.", zh: "从 npm 到群里，四步。" },
    "install.lede":   {
      en: `<code>sintbot setup</code> does most of it: it checks the machine, verifies the app credentials against the platform and binds your first group to a project folder.`,
      zh: `大部分事由 <code>sintbot setup</code> 完成：检查环境，拿凭据向平台核验，把第一个群绑到一个项目目录。`
    },
    "install.quick": {
      en: `Or let one line do steps 1, 3 and 4 on macOS or Linux — it installs Node 22 if needed, then sintbot, then Claude Code through the wizard, asking before each change:`,
      zh: `也可以一行命令做完第 1、3、4 步（macOS / Linux）：需要时先装 Node 22，再装 sintbot，向导里再装 Claude Code，每一步先问你：`
    },
    "install.cn": {
      en: ``,
      zh: `<b>在中国大陆？</b>聊天平台用飞书；没有 Claude 订阅就用 DeepSeek，直连、不用代理；Codex 可以不装。向导问「这台机器在中国大陆吗」时答「是」。`
    },
    "install.1.title": { en: "Install from npm", zh: "从 npm 安装" },
    "install.1.after": {
      en: `Installs the <code>sintbot</code> command. The wizard in step 3 checks for Claude Code and offers to install it; to use Claude itself, log in once with <code>claude auth login</code>. DeepSeek, GLM and other key-based models need no login.`,
      zh: `装好后就有 <code>sintbot</code> 命令。第 3 步的向导会检查 Claude Code，没装会问要不要替你装；要用 Claude 本身，登录一次 <code>claude auth login</code>；DeepSeek、GLM 等用 key 的模型不用登录。`
    },
    "install.2.title": { en: "Create the chat bot", zh: "建好聊天机器人" },
    "install.2.after": {
      en: `A Feishu (Lark) self-built app using the long-connection event mode, a Slack app created from the manifest in the repository, or a WeCom smart bot in API mode with a long connection — no public IP in any case. Step-by-step: <a href="https://github.com/WaterTian/sintbot/blob/main/docs/platforms/feishu.md" target="_blank" rel="noopener">Feishu</a> · <a href="https://github.com/WaterTian/sintbot/blob/main/docs/platforms/slack.md" target="_blank" rel="noopener">Slack</a> · <a href="https://github.com/WaterTian/sintbot/blob/main/docs/platforms/wecom.md" target="_blank" rel="noopener">WeCom</a>. Then add the bot to your group.`,
      zh: `飞书建一个企业自建应用、事件订阅选长连接，或在 Slack 用仓库里的 manifest 建应用，或在企业微信建一个 API 模式、长连接的智能机器人——都不需要公网 IP。分步说明：<a href="https://github.com/WaterTian/sintbot/blob/main/docs/zh-CN/platforms/feishu.md" target="_blank" rel="noopener">飞书</a> · <a href="https://github.com/WaterTian/sintbot/blob/main/docs/zh-CN/platforms/slack.md" target="_blank" rel="noopener">Slack</a> · <a href="https://github.com/WaterTian/sintbot/blob/main/docs/zh-CN/platforms/wecom.md" target="_blank" rel="noopener">企业微信</a>。建好后把机器人拉进群。`
    },
    "install.3.title": { en: "Run the setup wizard", zh: "跑一遍向导" },
    "install.3.after": {
      en: `It first checks whether you’re logged in to Claude or Codex; if neither, it recommends DeepSeek and runs a trial turn as soon as you paste the API key. Then pick your platforms, paste the credentials (checked against the platform on the spot), choose a projects folder and bind the first group. It ends with a health check — fix anything marked ✗ before moving on.`,
      zh: `先看你登录了 Claude 还是 Codex，都没有就推荐 DeepSeek，粘贴 API key 当场试跑一轮；再选平台、粘贴凭据（当场向平台核验）、选项目根目录、绑定第一个群。最后跑一遍体检，标 ✗ 的先处理掉再往下走。`
    },
    "install.4.title": { en: "Keep it running", zh: "常驻运行" },
    "install.4.after": {
      en: `Restarted on crash and started at login (macOS launchd; Linux systemd is experimental; on Windows it prints the commands to set one up). Now @ the bot in your group. The local console is at <code>http://127.0.0.1:4600</code>.`,
      zh: `崩溃自动拉起、登录即启动（macOS 用 launchd；Linux 的 systemd 为实验性；Windows 上只打印设置命令）。然后在群里 @ 机器人就行。本地控制台在 <code>http://127.0.0.1:4600</code>。`
    },

    "commands.h":       { en: "Everyday commands", zh: "常用命令" },
    "commands.doctor":  { en: "health check & diagnostics", zh: "体检与诊断" },
    "commands.service": { en: "is the service up, and what is it doing", zh: "服务在不在、在做什么" },
    "commands.trial":   { en: "a read-only trial turn in the terminal", zh: "在终端里只读试跑一轮" },
    "commands.chat":    { en: "in the group: switch model, check progress, stop, start fresh (Slack uses a ! prefix)", zh: "群里：换模型、看进度、叫停、开新会话（Slack 里用 ! 前缀）" },
    "ccbot.kicker": { en: "Sibling project", zh: "姊妹项目" },
    "ccbot.h": { en: "cc-bot — the plugin edition", zh: "cc-bot：插件版" },
    "ccbot.body": {
      en: `Prefer to keep it inside Claude Code? cc-bot is a Claude Code plugin: install it in your own session, and the group talks to that session. Feishu and Slack, MIT-licensed.`,
      zh: `更想让它待在 Claude Code 里？cc-bot 是一个 Claude Code 插件：装进你自己的会话，群里的消息就交给这个会话处理。支持飞书与 Slack，MIT 许可。`
    },
    "ccbot.vs.sintbot": {
      en: `<b>SintBot</b>A standalone daemon: no one has to keep a terminal open, and each group gets its own project, model and permissions.`,
      zh: `<b>SintBot</b>独立守护进程：不用有人守着终端，每个群各有项目、模型和权限。`
    },
    "ccbot.vs.ccbot": {
      en: `<b>cc-bot</b>A plugin: it runs inside the Claude Code session you already have open, on that session’s model.`,
      zh: `<b>cc-bot</b>插件：跑在你已经打开的 Claude Code 会话里，用的就是这个会话的模型。`
    },
    "ccbot.then": {
      en: `Then run <code>/plugin install cc-bot@cc-bot</code> and <code>/cc-bot:setup</code> inside Claude Code.`,
      zh: `然后在 Claude Code 里依次运行 <code>/plugin install cc-bot@cc-bot</code> 和 <code>/cc-bot:setup</code>。`
    },

    // ---- faq -------------------------------------------------------------
    // Also the source of the FAQPage JSON-LD and /llms.txt (scripts/build-zh.mjs):
    // answers must stay plain facts that the daemon's current version backs up.
    "faq.kicker": { en: "FAQ", zh: "常见问题" },
    "faq.h":      { en: `Asked often, <em>answered plainly.</em>`, zh: `常被问到的，<em>直接回答。</em>` },
    "faq.1.q": { en: "What is SintBot?", zh: "SintBot 是什么？" },
    "faq.1.a": {
      en: `A self-hosted daemon that binds a chat group — Lark, Slack or WeCom — to a project on your own machine. Anyone in the group can hand it work; it runs Claude Code or Codex inside that project and posts progress and results back to the group.`,
      zh: `一个跑在你自己机器上的守护进程：把一个聊天群（飞书、Slack 或企业微信）绑定到一个项目。群里谁都能派活，它在这个项目里运行 Claude Code 或 Codex，把进度和结果发回群里。`
    },
    "faq.2.q": { en: "How is it different from cc-bot?", zh: "它和 cc-bot 有什么区别？" },
    "faq.2.a": {
      en: "Both are free and MIT-licensed. cc-bot is a Claude Code plugin: it lives inside your interactive session and uses that session's model. SintBot is a standalone daemon — nobody needs to keep a terminal open, each group has its own project, model and permissions, it drives both Claude Code and Codex, and it comes with a local console.",
      zh: "两者都免费、都是 MIT 许可。cc-bot 是 Claude Code 插件，运行在你的交互会话里，用的就是该会话的模型。SintBot 是独立的守护进程：不需要有人守着终端，每个群有自己的项目、模型和权限，同时驱动 Claude Code 和 Codex，并自带本地控制台。"
    },
    "faq.3.q": { en: "Which models can it use?", zh: "支持哪些模型？" },
    "faq.3.a": {
      en: "Claude through your local Claude Code login, GPT through your Codex subscription login, and DeepSeek, GLM or MiniMax with your own keys (without a subscription we recommend DeepSeek). Kimi or any other endpoint that speaks the Anthropic API — including an open-source model you host yourself — can be added as a custom endpoint. Each group picks its own, and anyone in the group can switch with /model.",
      zh: "Claude 用本机的 Claude Code 登录，GPT 用你的 Codex 订阅登录；DeepSeek、GLM、MiniMax 用你自己的 key（没有订阅时推荐 DeepSeek）；Kimi 等任何兼容 Anthropic 接口的端点，包括你自己部署的开源模型，都可以作为自定义端点添加。每个群各选各的，群里任何人都能用 /model 切换。"
    },
    "faq.4.q": { en: "Does switching models lose the project's memory?", zh: "换模型会丢掉项目记忆吗？" },
    "faq.4.a": {
      en: "No. A switch starts a fresh conversation, but the project's CLAUDE.md, AGENTS.md and memory directory are handed to whichever agent runs next, so conventions and long-term notes carry over. Long sessions are compacted automatically.",
      zh: "不会。换模型会开一段新对话，但项目里的 CLAUDE.md、AGENTS.md 和记忆目录会交给接下来运行的 agent，约定和长期记忆都还在。长会话会自动压缩。"
    },
    "faq.5.q": { en: "Where do my code and data live?", zh: "代码和数据存在哪？" },
    "faq.5.a": {
      en: "On your machine: project directories, sessions, memory and logs stay there. The daemon talks only to the services you configure — your chat platform and your model endpoints — and nothing is sent to us. Secrets are masked before any message reaches the group.",
      zh: "都在你自己的机器上：项目目录、会话、记忆和日志都留在本地。守护进程只和你配置的服务通信（聊天平台和模型端点），不会发给我们。消息发进群之前，密钥类内容会先被遮掉。"
    },
    "faq.6.q": { en: "Do I need a server or a public IP?", zh: "需要服务器或公网 IP 吗？" },
    "faq.6.a": {
      en: `No. It runs on a computer you keep on — a Mac is the tested setup; Linux support is experimental and Windows is not yet verified — and it only dials out: a WebSocket long connection for Lark, Socket Mode for Slack, a long connection for WeCom. The console stays on that machine unless you choose to open it up.`,
      zh: `不需要。它跑在一台常开的电脑上（Mac 是验证过的环境；Linux 为实验性支持，Windows 尚未验证），只向外连接：飞书用 WebSocket 长连接，Slack 用 Socket Mode，企业微信用长连接。控制台默认只在本机，除非你自己选择开放。`
    },
    "faq.7.q": { en: "What can the agent do by default?", zh: "默认情况下 agent 能做什么？" },
    "faq.7.a": {
      en: "Read only. Permissions are set per group, never globally: an unconfigured group can read and nothing else. You can grant a tool preset or full access. File tools always stay inside the project directory bound to that group, but with full access shell commands can reach anything your user account can.",
      zh: "只能读。权限按群设置，没有全局开关：没配置过的群只能读取。你可以给某个群一档工具预设或完全访问。文件工具始终只在这个群绑定的项目目录里，但完全访问下，命令行能碰到你这个系统用户能碰到的一切。"
    },
    "faq.8.q": { en: "How do I get SintBot?", zh: "怎么获取 SintBot？" },
    "faq.8.a": {
      en: `Install it from npm: <code>npm i -g sintbot</code>, then <code>sintbot setup</code>. It is free and open source under the MIT license; source and docs are at <a href="https://github.com/WaterTian/sintbot" target="_blank" rel="noopener">github.com/WaterTian/sintbot</a>.`,
      zh: `从 npm 安装：<code>npm i -g sintbot</code>，再跑 <code>sintbot setup</code>。免费、MIT 开源，源码和文档在 <a href="https://github.com/WaterTian/sintbot" target="_blank" rel="noopener">github.com/WaterTian/sintbot</a>。`
    },
    "faq.9.q": { en: "Do I need a Claude subscription?", zh: "必须有 Claude 订阅吗？" },
    "faq.9.a": {
      en: "No. The setup wizard checks whether this machine is logged in to Claude or to Codex (ChatGPT); if neither, it recommends DeepSeek — paste an API key and it runs a trial turn on the spot. Claude Code is still the agent framework; it just needs no login. Without Claude or ChatGPT you lose only GPT groups and image generation.",
      zh: "不需要。配置向导会先看这台机器登录了 Claude 还是 Codex（ChatGPT）；都没有就推荐 DeepSeek，粘贴 API key 当场试跑一轮。执行框架仍是 Claude Code，只是不用登录。没有 Claude 和 ChatGPT 时，用不了的只有 GPT 群和生图。"
    },
    "faq.10.q": { en: "Can I use it in mainland China?", zh: "在中国大陆能用吗？" },
    "faq.10.a": {
      en: "Yes. Use Feishu as the chat platform and DeepSeek (or the mainland sites of Zhipu GLM or MiniMax) as the model: they connect directly, with no proxy. A proxy is needed only for Claude, ChatGPT or Slack.",
      zh: "能。聊天平台用飞书，模型用 DeepSeek（或智谱 GLM、MiniMax 的中国大陆站），都是直连、不用代理。只有用 Claude、ChatGPT 或 Slack 才需要代理。"
    },

    // ---- cta / footer ----------------------------------------------------
    "cta.h": { en: "Put the project in the group.", zh: "把项目放进群里。" },
    "cta.p": {
      en: `See the daemon at work in a Lark, Slack or WeCom group, or install it now: <code>npm i -g sintbot</code>.`,
      zh: `看守护进程在飞书、Slack 或企业微信群里怎么干活，或者现在就装：<code>npm i -g sintbot</code>。`
    },
    "cta.see": {
      en: "See how it works",
      zh: "看它怎么工作"
    },
    "cta.plugin": {
      en: "Source on GitHub",
      zh: "GitHub 上的源码"
    },

    "foot.tag":     { en: `Open source (MIT) · self-hosted · Lark, Slack & WeCom · desktop pet in the works`, zh: `MIT 开源 · 自托管 · 飞书 · Slack · 企业微信 · 桌宠研发中` },
    "foot.privacy": { en: "Privacy Policy",   zh: "隐私政策" },
    "foot.terms":   { en: "Terms of Service", zh: "服务条款" },
    "foot.meta":    {
      en: `Not affiliated with Lark, Slack, WeCom (Tencent), Anthropic, OpenAI or any other model provider named here. Logos belong to their owners and are shown only to identify the platforms and models.`,
      zh: `与飞书、Slack、企业微信（腾讯）、Anthropic、OpenAI 及本站提到的其他模型厂商无任何隶属关系；标志归各自所有者，仅用于标明平台与模型。`
    },

    "copy": { en: "copy", zh: "复制" },

    "totop.label": { en: "Back to top", zh: "返回顶部" }
  };

  // 只存访客亲手点过的语言(2026-10-20 起默认英文)。旧键 cc_bot_site_lang 里大多是按浏览器语言自动存的,换新键作废
  const STORAGE_KEY = "sintbot_site_lang";

  // Each language has its own URL: / (en) and /zh/ (zh, generated by scripts/build-zh.mjs),
  // so a copied link carries its language and share cards come out in that language.
  const onZhPath = /^\/zh(\/|$)/.test(window.location.pathname);
  let forcedByQuery = false;

  function pickInitialLang() {
    // ?lang=en|zh wins (used for previews / screenshots) and leaves the URL alone.
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q === "en" || q === "zh") { forcedByQuery = true; return q; }
    } catch (_) { /* ignore */ }
    // An explicit /zh/ link means Chinese, whatever was chosen before.
    if (onZhPath) return "zh";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh") return saved;
    } catch (_) { /* ignore */ }
    // Default is English, whatever the browser language; Chinese is a click (or /zh/) away.
    return "en";
  }

  // Keep the address bar on the language's own path without reloading.
  // Assets and page links are root-absolute, so the document works under either path.
  function syncPath(lang) {
    if (forcedByQuery || !window.history || !history.replaceState) return;
    const want = lang === "zh" ? "/zh/" : "/";
    const path = window.location.pathname;
    const isHome = path === "/" || path === "/index.html" || /^\/zh(\/|\/index\.html)?$/.test(path);
    if (!isHome || path === want) return;
    const search = window.location.search.replace(/([?&])lang=(en|zh)(&|$)/, "$1").replace(/[?&]$/, "");
    try { history.replaceState(history.state, "", want + search + window.location.hash); } catch (_) { /* ignore */ }
  }

  function applyLang(lang, persist) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    if (translations["meta.title"]) document.title = translations["meta.title"][lang === "zh" ? "zh" : "en"];
    syncPath(lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const entry = translations[key];
      if (!entry) return;
      const value = entry[lang] != null ? entry[lang] : entry.en;
      el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const entry = translations[key];
      if (!entry) return;
      const value = entry[lang] != null ? entry[lang] : entry.en;
      el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-svg]").forEach((el) => {
      const key = el.getAttribute("data-i18n-svg");
      const entry = translations[key];
      if (!entry) return;
      const value = entry[lang] != null ? entry[lang] : entry.en;
      el.textContent = value;
    });

    // <img alt> — attribute, not text content
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      const entry = translations[key];
      if (!entry) return;
      const value = entry[lang] != null ? entry[lang] : entry.en;
      el.setAttribute("alt", value);
    });

    document.querySelectorAll(".lang-toggle__btn").forEach((b) => {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });

    if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ } }
  }

  const initialLang = pickInitialLang();
  applyLang(initialLang, false); // only an explicit toggle click is remembered

  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-lang");
      if (target !== "en" && target !== "zh") return;
      forcedByQuery = false; // an explicit click is a real choice: persist it and move the URL
      applyLang(target, true);
    });
  });

  // 1) Reveal on scroll ---------------------------------------------------
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  revealEls.forEach((el) => {
    const delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
    if (delay) el.style.transitionDelay = delay + "ms";
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // When the language toggles after initial load, the hero title's inner
  // spans are re-rendered via innerHTML — re-apply reveal state so the new
  // spans appear instead of staying invisible.
  function refreshHeroReveal() {
    document.querySelectorAll(".hero__title-en [data-reveal]").forEach((el) => {
      const delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
      if (delay) el.style.transitionDelay = delay + "ms";
      requestAnimationFrame(() => el.classList.add("is-in"));
    });
  }
  refreshHeroReveal();
  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", () => requestAnimationFrame(refreshHeroReveal));
  });

  // 2) Soft cursor glow ---------------------------------------------------
  // The glow is a subtle ambient layer, not a motion-heavy animation, so it
  // ignores prefers-reduced-motion (which Win11 often reports `reduce` even
  // when the user has a normal mouse, just because OS "animation effects"
  // is off — that shouldn't kill a slow follow-spot).
  // (any-pointer: fine) instead of (pointer: fine) covers touch-hybrid laptops.
  if (window.matchMedia("(any-pointer: fine)").matches) {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      let raf = 0;
      let tx = window.innerWidth / 2;
      let ty = window.innerHeight / 2;
      let cx = tx;
      let cy = ty;
      // Position immediately at viewport center + show, so the glow is
      // visible even before the first mousemove (Win Chrome: mouseenter
      // doesn't fire when cursor is already inside the window on load).
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      document.body.classList.add("cursor-on");

      window.addEventListener(
        "mousemove",
        (e) => {
          tx = e.clientX;
          ty = e.clientY;
          document.body.classList.add("cursor-on");
          if (!raf) raf = requestAnimationFrame(tick);
        },
        { passive: true }
      );
      function tick() {
        cx += (tx - cx) * 0.14;
        cy += (ty - cy) * 0.14;
        glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      }
    }
  }

  // 3) Copy buttons -------------------------------------------------------
  document.querySelectorAll(".copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        const original = btn.textContent;
        const lang = document.documentElement.lang.indexOf("zh") === 0 ? "zh" : "en";
        btn.textContent = lang === "zh" ? "已复制" : "copied";
        btn.classList.add("is-ok");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("is-ok");
        }, 1400);
      } catch (err) {
        btn.textContent = "press ctrl-c";
        setTimeout(() => {
          const lang = document.documentElement.lang.indexOf("zh") === 0 ? "zh" : "en";
          btn.textContent = lang === "zh" ? "复制" : "copy";
        }, 1600);
      }
    });
  });

  // 4) Back-to-top button — show after roughly one viewport of scroll ---
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    let rafTop = 0;
    const updateToTop = () => {
      toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight);
      rafTop = 0;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!rafTop) rafTop = requestAnimationFrame(updateToTop);
      },
      { passive: true }
    );
    updateToTop();
  }

  // 5) Smooth-scroll anchors with offset for sticky nav ------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector(".nav")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  // 6) Analytics — Umami custom events ----------------------------------
  // Pageview is sent automatically by script.js. Below are intent-level
  // events via umami.track(). script.js loads async (defer); all events
  // fire on user interaction or scroll, by which point window.umami exists.
  function track(name) {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name);
    }
  }

  // copy buttons — split by what was copied
  document.querySelectorAll(".copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy") || "";
      if (text.includes("npm i -g sintbot")) {
        track("copy-install");
      } else if (text.includes("sintbot setup")) {
        track("copy-setup");
      } else if (text.includes("service install")) {
        track("copy-start");
      } else {
        track("copy-other");
      }
    });
  });

  // language toggle
  document.querySelectorAll(".lang-toggle__btn[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      track("lang-" + lang);
    });
  });

  // primary CTA — hero + closing 'See how it works' (#platforms)
  document.querySelectorAll('.btn--primary[href="#platforms"]').forEach((btn) => {
    btn.addEventListener("click", () => track("cta-meet"));
  });

  // secondary CTA — hero + closing 'Source on GitHub' (github-click fires too)
  document.querySelectorAll('[data-track="cta-github"]').forEach((a) => {
    a.addEventListener("click", () => track("cta-github"));
  });

  // outbound GitHub links
  document.querySelectorAll('a[href*="github.com/WaterTian"]').forEach((a) => {
    a.addEventListener("click", () => track("github-click"));
  });

  // pillar card clicks
  document.querySelectorAll('.pillar__link').forEach((a) => {
    a.addEventListener("click", () => track("pillar-click"));
  });

  // section reach — fire once the first time each section scrolls into view
  if ("IntersectionObserver" in window) {
    const seen = new Set();
    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            track("section-" + id);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("main section[id]").forEach((s) => secObs.observe(s));
  }

  // 8) (removed 2026-09-15) Hero parallax — the five hero layers used to drift at
  //    different rates while scrolling, so the headline's own lines slid past
  //    each other. Judged a distraction, not an effect; nothing scroll-linked
  //    moves in the hero any more. The one-shot reveal on load stays.
})();
