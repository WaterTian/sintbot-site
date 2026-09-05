// sintbot.com — vanilla JS for reveal-on-scroll, copy buttons,
// soft cursor glow, per-element reveal delays, and EN/zh-CN i18n.
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 0) i18n ----------------------------------------------------------------
  // Code blocks, command names and identifiers stay English in both modes.

  // cc-bot version — single source of truth for every cc-bot version string
  // on the page. Mirror of WaterTian/cc-bot (.claude-plugin/plugin.json).
  // Bump this one line only; the plugin section below interpolates it.
  const VERSION = "0.1.48";

  const translations = {
    "nav.platforms":     { en: "Platforms",      zh: "平台" },
    "nav.models":        { en: "Models",         zh: "模型" },
    "nav.design":        { en: "Design",         zh: "设计" },
    "nav.console":       { en: "Console",        zh: "控制台" },
    "nav.setup":         { en: "Setup",          zh: "接入" },
    "nav.pricing":       { en: "Pricing",        zh: "定价" },

    // ---- hero ------------------------------------------------------------
    "hero.eyebrow":      { en: "Self-hosted daemon · Lark & Slack · Claude Code & Codex",
                           zh: "自托管守护进程 · 飞书 & Slack · Claude Code & Codex" },
    "hero.titleEn": {
      en: `<span data-reveal data-reveal-delay="0">Mention it.</span>
           <em data-reveal data-reveal-delay="120">It delivers.</em>
           <span data-reveal data-reveal-delay="240">From your own machine.</span>`,
      zh: `<span data-reveal data-reveal-delay="0">群里 @ 一下</span>
           <em data-reveal data-reveal-delay="120">它就开工</em>
           <span data-reveal data-reveal-delay="240">全程在你自己的机器上</span>`
    },
    "hero.lede": {
      en: `Bind a Lark or Slack group to a project, mention <code>SintBot</code>, and it reads and changes the code, does the design work and reports back — all from your own machine.`,
      zh: `一个飞书群或 Slack 群绑一个项目。@ 一下 <code>SintBot</code>，它读代码、改代码、做设计、出报告——全程在你自己的机器上。`
    },
    "hero.cta.primary": {
      en: "See how it works",
      zh: "看它怎么工作"
    },
    "hero.cta.plugin": {
      en: "Free plugin",
      zh: "免费插件"
    },

    // ---- hero mockups ----------------------------------------------------
    "plat.lark":         { en: "Lark", zh: "飞书" },
    "mock.lark.title":   { en: "Design review",   zh: "设计评审" },
    "mock.lark.kind":    { en: "streaming card",  zh: "流式卡片" },
    "mock.lark.user":    { en: "Mei · Design",    zh: "小梅 · 设计" },
    "mock.lark.ask":     { en: "@SintBot redo the homepage in the tech-dark style",
                           zh: "@SintBot 把首页按科技深色风格出一版" },
    "mock.lark.state":   { en: "Delivered · 4m 21s", zh: "已交付 · 4 分 21 秒" },
    "mock.lark.l1":      { en: "Read the style file · DESIGN.md", zh: "读取风格档 · DESIGN.md" },
    "mock.lark.l2":      { en: "Generated two versions · hero + pricing", zh: "生成两版 · 首屏 + 定价" },
    "mock.lark.l3":      { en: "Pre-delivery check · 0 mismatches", zh: "交付前核对 · 0 处不一致" },
    "mock.lark.b1":      { en: "Open preview",     zh: "打开预览" },
    "mock.lark.b2":      { en: "Edit per annotation", zh: "按标注改图" },
    "mock.eq":           { en: "same daemon",      zh: "同一个守护进程" },
    "mock.slack.working":{ en: "Working…",         zh: "Working…" },
    "mock.slack.user":   { en: "Lin · PM",         zh: "Lin · 产品" },
    "mock.slack.ask":    { en: "@SintBot signup is throwing 500 on staging — look into it",
                           zh: "@SintBot signup 在 staging 报 500，查一下" },
    "mock.slack.ack":    { en: "Got it — working in the thread", zh: "收到，线程里跟进" },
    "mock.slack.thread": { en: "Thread · 3 replies", zh: "线程 · 3 条回复" },
    "mock.slack.progress": { en: "Reading logs · 2/5", zh: "正在读日志 · 2/5" },
    "mock.slack.final":  {
      en: `Found it: <code>hashPassword</code> is missing an <code>await</code>. Opened <a href="#" onclick="return false">PR #482</a>.`,
      zh: `已定位：<code>hashPassword</code> 少了 <code>await</code>，已开 <a href="#" onclick="return false">PR #482</a>。`
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
      en: `<code>sintbot</code> is the daemon: one project per group, each turn handed to Claude Code or Codex headless, progress in the group, permissions per group. <code>cc-bot</code> is the free plugin for your own Claude Code session.`,
      zh: `<code>sintbot</code> 是守护进程：一群一项目，每一轮交给无头的 Claude Code 或 Codex，进度在群里、权限按群管。<code>cc-bot</code> 是免费插件，装进你自己的 Claude Code 会话。`
    },
    "what.bot.link": { en: "See it on Lark and Slack →", zh: "看飞书与 Slack 里的样子 →" },
    "what.pet.title":{ en: "Desktop pet", zh: "桌宠" },
    "what.pet.body": {
      en: "A creature on your desktop that watches your local Claude Code work and reacts out loud, with its own voice and personality. In development — we'll announce it here.",
      zh: "一只趴在你桌面的虚拟形象：旁听你本机的 Claude Code 工作，用自己的声音和性格出声回应。研发中——上线会在这里公布。"
    },
    "what.pet.soon": { en: "In the works — not released yet", zh: "研发中 · 尚未上线" },

    "facts.platforms": { en: "platforms — Lark and Slack", zh: "个平台 —— 飞书与 Slack" },
    "facts.runners":   { en: "agent runners — Claude Code and Codex", zh: "套 agent runner —— Claude Code 与 Codex" },
    "facts.models":    { en: "model backends, swappable per group", zh: "种模型后端，按群可换" },
    "facts.styles":    { en: "built-in design styles", zh: "套内置设计风格" },
    "facts.redact":    { en: "outbound redaction patterns", zh: "类出站脱敏模式" },
    "facts.tests":     { en: "unit tests", zh: "个单元测试" },

    // ---- platforms -------------------------------------------------------
    "plat.kicker": { en: "01 · Platforms", zh: "01 · 平台" },
    "plat.h":      { en: `Lark and Slack, <em>side by side.</em>`, zh: `飞书与 Slack，<em>平级。</em>` },
    "plat.lede": {
      en: "Each group picks its platform, both can run in one daemon, and the rest is identical: one project per group, mention it or just talk, no public IP, progress you can stop, the same permissions and console.",
      zh: "每个群自己选平台，两个平台可以跑在同一个守护进程里，其余完全一样：一群一项目、@ 它或直接说、免公网 IP、进度可停、同一套权限与控制台。"
    },
    "plat.lark.h":   { en: "In a Lark group", zh: "在飞书群里" },
    "plat.lark.1.t": { en: "Streaming card", zh: "流式卡片" },
    "plat.lark.1.b": {
      en: "The reply card updates while the work runs; the result and its buttons land in the same card.",
      zh: "回复卡片边跑边更新，结果和按钮落在同一张卡里。"
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
    "plat.core.label": { en: "Shared core", zh: "共同内核" },
    "plat.core.1": { en: "one group, one project", zh: "一群一项目" },
    "plat.core.2": { en: "mention it, or just talk", zh: "@ 它，或直接说" },
    "plat.core.3": { en: "no public IP", zh: "免公网 IP" },
    "plat.core.4": { en: "progress visible, stoppable", zh: "进度可见可停" },
    "plat.core.5": { en: "same permissions & redaction", zh: "同一套权限与脱敏" },
    "plat.core.6": { en: "one console", zh: "同一个控制台" },
    "plat.discord": { en: "Discord — next release", zh: "Discord —— 下一版支持" },

    // ---- flow ------------------------------------------------------------
    "flow.kicker": { en: "02 · How it works", zh: "02 · 怎么跑" },
    "flow.h":      { en: `From <em>@</em> to delivery.`, zh: `从 <em>@</em> 到交付。` },
    "flow.lede": {
      en: "The daemon on your machine checks the group’s permissions, hands the turn to Claude Code or Codex inside the project directory, and streams progress back — on whatever model you chose for that group.",
      zh: "你机器上的守护进程核对这个群的权限，把这一轮交给项目目录里的 Claude Code 或 Codex，进度回流到群——模型是你给这个群选的那一个。"
    },
    "flow.return":        { en: "progress + result back to the group", zh: "进度 + 结果回群" },
    "flow.col.group":     { en: "Group", zh: "群" },
    "flow.group.note1":   { en: "mention it, or just talk", zh: "@ 它，或直接说" },
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
    "flow.side.dir":      { en: "project directory · fenced", zh: "项目目录 · 围栏" },
    "flow.side.design":   { en: "design toolchain", zh: "设计工具链" },
    "flow.side.design.note": { en: "style file · check · images · preview", zh: "风格档 · 核对 · 生图 · 预览" },
    "flow.caption": {
      en: "Left to right: group → daemon → runner → model. Dotted: progress and results return; the console, the fenced project directory and the design toolchain hang off the daemon.",
      zh: "从左到右：群 → 守护进程 → runner → 模型。虚线：进度与结果回流；控制台、带围栏的项目目录、设计工具链挂在守护进程旁。"
    },

    // ---- models ----------------------------------------------------------
    "models.kicker": { en: "03 · Models", zh: "03 · 模型" },
    "models.h":      { en: `Same agent. <em>Any brain.</em>`, zh: `同一套 agent，<em>任意大脑。</em>` },
    "models.lede": {
      en: "Claude Code against any Anthropic-compatible endpoint, or Codex through the machine’s own login — the daemon treats both alike, and swapping the model only changes what the next turn starts with.",
      zh: "Claude Code 接任何 Anthropic 兼容端点，Codex 用机器上的登录态——守护进程一视同仁，换模型只是换下一轮启动时带的参数。"
    },
    "models.p.claude":   { en: "local login, no key needed", zh: "本机登录态，不用配 key" },
    "models.p.gpt":      { en: "via your Codex subscription", zh: "走你的 Codex 订阅" },
    "models.p.glm":      { en: "your own key", zh: "你自己的 key" },
    "models.p.deepseek": { en: "your own key", zh: "你自己的 key" },
    "models.p.minimax":  { en: "your own key", zh: "你自己的 key" },
    "models.p.volcano":  { en: "your own key", zh: "你自己的 key" },
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
      en: "Images borrow the machine’s Codex subscription — no API key, instant reply, no group lock. Edit on the original, repaint a masked region, transparent background; the style file rides along.",
      zh: "生图借机器上的 Codex 订阅：零 API key，秒回，不占群锁。原图上改、遮罩局部重绘、透明底，项目风格档自动带上。"
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
      en: "The first time it shows an image, the daemon creates a whiteboard and pins it as a group tab. Draw arrows, drop notes, comment; press “edit per annotation” and the result returns to the same card. Every version and mark is kept — the board becomes the design’s history.",
      zh: "第一次要展示图时，守护进程自动建画板并挂成群标签页。画箭头、贴便签、写评论，点「按标注改图」，结果回填同一张卡。历史版本与标注全部保留，画板就是这份设计的演变档案。"
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
      en: "It reads the style file — or first offers three candidates, say tech-dark, precision-instrument and Swiss grid — builds the page and posts the check result with it.",
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
    "gov.t3.body":  { en: "The agent works only inside the project directory bound to that group.", zh: "agent 只能在这个群绑定的项目目录里干活。" },
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

    // ---- console ---------------------------------------------------------
    "con.kicker": { en: "07 · Console", zh: "07 · 控制台" },
    "con.h":      { en: `One local page for <em>every group.</em>`, zh: `一个本地网页，<em>管所有群。</em>` },
    "con.lede": {
      en: "The daemon serves its own console — a local page with no dependencies that listens on this machine only, unless you set a password and open it to the LAN.",
      zh: "守护进程自己提供控制台——零依赖的本地网页，默认只监听本机，设了密码才开给局域网。"
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
    "con.v.preview": { en: "on · :4173", zh: "运行中 · :4173" },
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
      en: "Create or dissolve a group, bind its project directory, link the repo, pause it; Lark and Slack cards with a preflight.",
      zh: "建群、解散群，绑项目目录，关联仓库，暂停群；飞书 / Slack 接入卡先预检。"
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
      en: "Live activity stream, scheduled tasks, running previews, feedback book, version history; per group stop, new session, interject.",
      zh: "实时活动流、定时任务、运行中的预览、反馈本、版本历史；每群一键停止、新会话、插话。"
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
      en: "A turn cut short by a release or restart is redone automatically within two hours. Runs as a service: launchd on macOS, NSSM or Task Scheduler on Windows.",
      zh: "被发版或重启打断的那一轮，两小时内自动重做。常驻：macOS 用 launchd 并防休眠，Windows 用 NSSM 或任务计划。"
    },
    "ops.3.c1": { en: "redo within 2h", zh: "2 小时内补做" },
    "ops.4.title": { en: "Scheduled in one sentence", zh: "一句话排定时任务" },
    "ops.4.body": {
      en: "Cron, aliases like daily, or plain “every day at 09:00”. A task can wake the agent like a message, post a fixed reminder, or run once.",
      zh: "cron、daily 别名，或直接写「每天 09:00」。到点可以像收到消息一样叫醒 agent，也可以只发提醒，或只跑一次。"
    },
    "ops.4.c2": { en: "natural language", zh: "中文简写" },
    "ops.4.c3": { en: "one-off", zh: "一次性" },
    "ops.5.title": { en: "Tells the group what changed", zh: "升级了，告诉群" },
    "ops.5.body": {
      en: "After an upgrade the daemon reads its changelog and posts the new abilities to each group.",
      zh: "守护进程升级后，按更新日志把新能力发到各个群。"
    },
    "ops.5.c1": { en: "upgrade broadcast", zh: "升级播报" },
    "ops.5.c2": { en: "per group", zh: "逐群" },
    "ops.6.title": { en: "Small footprint, smart egress", zh: "依赖少，出网会分流" },
    "ops.6.body": {
      en: "Node 18.17+ with two runtime dependencies; you install Claude Code and Codex. Official Claude goes through your proxy, domestic endpoints connect direct.",
      zh: "Node 18.17 起，运行时依赖两个；Claude Code 和 Codex 你自己装。官方 Claude 走代理，国内端点直连，自动分流。"
    },
    "ops.6.c2": { en: "2 runtime deps", zh: "2 个运行时依赖" },
    "ops.6.c3": { en: "auto proxy split", zh: "代理自动分流" },

    // ---- cc-bot plugin ---------------------------------------------------
    "plugin.kicker": { en: "09 · Free plugin", zh: "09 · 免费插件" },
    "plugin.h":      { en: `<em>cc-bot</em> — the free way to run it.`, zh: `<em>cc-bot</em>——免费的另一种跑法。` },
    "plugin.lede": {
      en: `<code>cc-bot</code> is an MIT Claude Code plugin: it lives inside your interactive session, follows that session’s model and brings Slack and Lark adapters — no daemon, no console.`,
      zh: `<code>cc-bot</code> 是 MIT 的 Claude Code 插件：活在你的交互会话里，跟随该会话的模型，自带 Slack 与飞书适配器——没有守护进程、没有控制台。`
    },
    "plugin.meta.kind": { en: `Claude Code plugin · v${VERSION}`, zh: `Claude Code 插件 · v${VERSION}` },

    "install.h":      { en: "Four steps to a chat-driven repo.", zh: "四步开启群聊驱动的仓库。" },
    "install.lede":   {
      en: `<code>/cc-bot:setup</code> runs the whole flow inside Claude Code — idempotent, version-aware, auto-detects what it can.`,
      zh: `<code>/cc-bot:setup</code> 在 Claude Code 内完整跑完——幂等、识别版本、能自动识别的都自动识别。`
    },
    "install.1.title": { en: "Install the cc-bot plugin", zh: "安装 cc-bot 插件" },
    "install.1.after": {
      en: `Then run <code>/cc-bot:setup</code> in any project. When asked "which IM?", pick <b>Slack</b>.`,
      zh: `然后在任意项目里执行 <code>/cc-bot:setup</code>。问到 IM 时选 <b>Slack</b>。`
    },
    "install.2.title": { en: "Create the Slack app from the manifest", zh: "用 manifest 创建 Slack 应用" },
    "install.2.after": {
      en: `Open <a href="https://api.slack.com/apps" target="_blank" rel="noopener">api.slack.com/apps</a> → <em>Create New App</em> → <em>From a manifest</em>. Paste the YAML below.`,
      zh: `打开 <a href="https://api.slack.com/apps" target="_blank" rel="noopener">api.slack.com/apps</a> → <em>Create New App</em> → <em>From a manifest</em>，粘贴下面的 YAML。`
    },
    "install.2.toggle": { en: "Show the manifest", zh: "展开 manifest" },
    "install.3.title": { en: "Generate the two tokens", zh: "生成两个 Token" },
    "install.3.after": { en: "In the new app's Basic Information page:", zh: "在新建应用的 Basic Information 页面：" },
    "install.3.li1":   {
      en: `<b>App-Level Token</b> — name it <code>cc-bot-socket</code>, scope <code>connections:write</code>. Copy the <code>xapp-1-…</code> value.`,
      zh: `<b>App-Level Token</b>——命名为 <code>cc-bot-socket</code>，scope 选 <code>connections:write</code>，复制 <code>xapp-1-…</code>。`
    },
    "install.3.li2":   {
      en: `<em>Install to Workspace</em> → Allow. Copy the <b>Bot User OAuth Token</b> (<code>xoxb-…</code>).`,
      zh: `<em>Install to Workspace</em> → Allow，复制 <b>Bot User OAuth Token</b>（<code>xoxb-…</code>）。`
    },
    "install.3.tail":  {
      en: `Paste both when <code>/cc-bot:setup</code> prompts. cc-bot verifies via <code>auth.test</code> and writes them into <code>.cc-bot/profiles/active.json</code>.`,
      zh: `<code>/cc-bot:setup</code> 提示时把两个 token 粘进去。cc-bot 通过 <code>auth.test</code> 校验，写入 <code>.cc-bot/profiles/active.json</code>。`
    },
    "install.4.title": { en: "Invite cc-bot to a channel", zh: "把 cc-bot 拉进频道" },
    "install.4.after": {
      en: `Paste the channel ID. In Slack, run <code>/invite @cc-bot</code> — bot sends a probe. Then bring it online:`,
      zh: `把 channel ID 粘进去，在 Slack 里执行 <code>/invite @cc-bot</code>，bot 会发一条探测消息。然后上线：`
    },
    "install.4.tail":  {
      en: `An "online" message lands in your channel. From here, talk to it like a teammate.`,
      zh: `频道会收到一条上线消息。接下来，把它当队友一样说话即可。`
    },

    "commands.h":      { en: "Slash commands", zh: "斜杠命令" },
    "commands.setup":  { en: "interactive Slack / Lark onboarding", zh: "Slack / 飞书 引导式接入" },
    "commands.start":  { en: "bring the bot online",                zh: "上线" },
    "commands.stop":   { en: "take it offline",                     zh: "下线" },
    "commands.new":    { en: "clone the profile template",          zh: "克隆 profile 模板" },
    "commands.switch": { en: "swap active profile",                 zh: "切换当前 profile" },
    "commands.doctor": { en: "health check & diagnostics",          zh: "健康检查与诊断" },

    // ---- pricing ---------------------------------------------------------
    "pricing.kicker": { en: "Pricing", zh: "定价" },
    "pricing.h": {
      en: `Two ways to <em>run it.</em>`,
      zh: `<em>两种</em>跑法。`
    },
    "pricing.lede": {
      en: `<code>cc-bot</code> is free and MIT; the <code>sintbot</code> daemon is delivered with a Pro subscription.`,
      zh: `<code>cc-bot</code> 免费、MIT；<code>sintbot</code> 守护进程随 Pro 订阅交付。`
    },

    "pricing.free.name":    { en: "Free", zh: "Free" },
    "pricing.free.amount":  { en: "$0", zh: "$0" },
    "pricing.free.cycle":   { en: "/ forever", zh: "/ 永久" },
    "pricing.free.tagline": { en: "A Claude Code plugin — lives inside your session.", zh: "一个 Claude Code 插件——活在你的会话里。" },
    "pricing.free.f0": {
      en: "Installs into Claude Code as a plugin — it runs in an interactive session and uses whatever model that session runs",
      zh: "以插件形式装进 Claude Code——跑在交互会话里，用的就是该会话的模型"
    },
    "pricing.free.f1": {
      en: "Full cc-bot core — Slack + Lark adapters, multi-session scheduling, permission matrix, HUD",
      zh: "cc-bot 完整核心——Slack + 飞书适配器、多会话调度、权限矩阵、HUD"
    },
    "pricing.free.f2": {
      en: "MIT licensed, self-hosted on your own machine",
      zh: "MIT 许可，在你自己机器上自托管"
    },
    "pricing.free.f3": {
      en: "Community support via GitHub Issues",
      zh: "GitHub Issues 社区支持"
    },
    "pricing.free.cta": { en: "Get cc-bot", zh: "获取 cc-bot" },
    "pricing.pro.name":    { en: "Pro", zh: "Pro" },
    "pricing.pro.amount":  { en: "$19.90", zh: "$19.90" },
    "pricing.pro.cycle":   { en: "/ month", zh: "/ 月" },
    "pricing.pro.tagline": {
      en: "Everything in Free, plus the sintbot daemon, delivered for you to self-host.",
      zh: "Free 的全部，外加交付给你自托管的 sintbot 守护进程。"
    },
    "pricing.pro.fsintbot": {
      en: `<b>sintbot</b> — the daemon: <b>Lark</b> and <b>Slack</b>, Claude Code and Codex with a swappable model per group, per-group permissions and redaction, the design toolchain, the local console, and scheduled tasks. <a href="#platforms">See what it does</a>.`,
      zh: `<b>sintbot</b>——守护进程：<b>飞书</b>与 <b>Slack</b>，Claude Code 与 Codex、模型按群可换，按群的权限与脱敏，设计工具链，本地控制台，定时任务。<a href="#platforms">看它能做什么</a>。`
    },
    "pricing.pro.f1": { en: "Everything in Free", zh: "Free 的全部" },
    "pricing.pro.f2": {
      en: "Priority email support — support@sintbot.com (3-business-day response)",
      zh: "优先邮件支持——support@sintbot.com（3 个工作日内回复）"
    },
    "pricing.pro.f3": { en: "Guided workspace onboarding", zh: "引导式 workspace 接入" },
    "pricing.pro.f4": {
      en: "Early access to new features",
      zh: "新功能早鸟"
    },
    "pricing.pro.f5": { en: "Funds open-source development", zh: "资助开源开发" },
    "pricing.pro.cta": { en: "Subscribe to Pro", zh: "订阅 Pro" },

    "pricing.note": {
      en: `sintbot is not a public download — after checkout, write to <a href="mailto:support@sintbot.com">support@sintbot.com</a> from your order address and we send you the package and setup guide. It ships as readable source under a source-available license: run and modify it on up to three devices you own, keep any version delivered while your subscription was active, but don't redistribute or resell it (<a href="terms.html">terms</a>). Prices in USD. Payments and taxes are handled by Creem as Merchant of Record. Cancel anytime from the <a href="https://www.creem.io/my-orders/login" target="_blank" rel="noopener">Creem customer portal</a>.`,
      zh: `sintbot 不是公开下载——付款后用下单邮箱写信到 <a href="mailto:support@sintbot.com">support@sintbot.com</a>，我们把安装包与部署指引发给你。它以可读源码形式交付，适用「源码可见、不可再分发」的许可：可在自有的至多三台设备上运行与修改，订阅期内已交付的版本可永久继续使用，但不得再分发或转售（<a href="terms.html">条款</a>）。价格为 USD。支付与税务由 Creem 作为 Merchant of Record 处理。可随时在 <a href="https://www.creem.io/my-orders/login" target="_blank" rel="noopener">Creem customer portal</a> 取消。`
    },

    // ---- cta / footer ----------------------------------------------------
    "cta.h": { en: "Put the project in the group.", zh: "把项目放进群里。" },
    "cta.p": {
      en: `See the daemon at work in a Lark or Slack group, or start free: <code>cc-bot</code> installs into Claude Code in two commands.`,
      zh: `看守护进程在飞书群或 Slack 群里怎么干活；想先免费试，<code>cc-bot</code> 两条命令装进 Claude Code。`
    },
    "cta.see": {
      en: "See how it works",
      zh: "看它怎么工作"
    },
    "cta.plugin": {
      en: "Free plugin on GitHub",
      zh: "GitHub 上的免费插件"
    },

    "foot.tag":     { en: "Self-hosted · Lark & Slack · cc-bot is MIT", zh: "自托管 · 飞书 & Slack · cc-bot 采用 MIT" },
    "foot.privacy": { en: "Privacy Policy",   zh: "隐私政策" },
    "foot.terms":   { en: "Terms of Service", zh: "服务条款" },
    "foot.meta":    {
      en: "SintBot showcase — rouserlab editorial pacing, the-field motion. Not affiliated with Slack, Lark, Anthropic or OpenAI.",
      zh: "SintBot 展示站点 —— 节奏取自 rouserlab，动作取自 the-field。与 Slack、飞书、Anthropic、OpenAI 无任何隶属关系。"
    },

    "copy": { en: "copy", zh: "复制" },

    "totop.label": { en: "Back to top", zh: "返回顶部" }
  };

  const STORAGE_KEY = "cc_bot_site_lang";

  function pickInitialLang() {
    // ?lang=en|zh wins (used for previews / screenshots); it is not persisted
    // over the visitor's saved choice unless they click the toggle.
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q === "en" || q === "zh") return q;
    } catch (_) { /* ignore */ }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh") return saved;
    } catch (_) { /* ignore */ }
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("zh") ? "zh" : "en";
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === "zh" ? "zh" : "en";

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

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }
  }

  const initialLang = pickInitialLang();
  applyLang(initialLang);

  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-lang");
      if (target !== "en" && target !== "zh") return;
      applyLang(target);
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
        const lang = document.documentElement.lang === "zh" ? "zh" : "en";
        btn.textContent = lang === "zh" ? "已复制" : "copied";
        btn.classList.add("is-ok");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("is-ok");
        }, 1400);
      } catch (err) {
        btn.textContent = "press ctrl-c";
        setTimeout(() => {
          const lang = document.documentElement.lang === "zh" ? "zh" : "en";
          btn.textContent = lang === "zh" ? "复制" : "copy";
        }, 1600);
      }
    });
  });

  // 4) Hero marquee parallax — folded into the unified hero parallax in
  //    section 8 (was a separate block here, gated by prefers-reduced-
  //    motion, which Win11 Chrome false-reports — so it never ran).

  // 4b) Back-to-top button — show after roughly one viewport of scroll ---
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
      if (text.includes("/plugin install")) {
        track("copy-install");
      } else if (text.includes("display_information")) {
        track("copy-manifest");
      } else if (text.includes("/cc-bot:start")) {
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

  // secondary CTA — hero + closing 'Free plugin' (GitHub; github-click fires too)
  document.querySelectorAll('[data-track="cta-plugin"]').forEach((a) => {
    a.addEventListener("click", () => track("cta-plugin"));
  });

  // outbound GitHub links
  document.querySelectorAll('a[href*="github.com/WaterTian"]').forEach((a) => {
    a.addEventListener("click", () => track("github-click"));
  });

  // pillar card clicks
  document.querySelectorAll('.pillar__link').forEach((a) => {
    a.addEventListener("click", () => track("pillar-click"));
  });

  // pricing CTAs — Pro (Creem checkout) vs Free (GitHub)
  document.querySelectorAll('.plan--pro .plan__cta').forEach((a) => {
    a.addEventListener("click", () => track("pricing-pro-click"));
  });
  document.querySelectorAll('.plan:not(.plan--pro) .plan__cta').forEach((a) => {
    a.addEventListener("click", () => track("pricing-free-click"));
  });

  // manifest disclosure — how many people actually open the YAML
  document.querySelectorAll(".step__details").forEach((d) => {
    d.addEventListener("toggle", () => { if (d.open) track("manifest-open"); });
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

  // 8) Hero parallax — staggered depth on the hero text while scrolling.
  // `translate` (standalone property) composes with the reveal's
  // `transform`. Each layer carries will-change so the browser keeps it
  // on its own compositor layer and caches the raster — including the
  // static per-layer blur (set in CSS) — so scrolling only re-composites
  // and never re-blurs: smooth, no jank.
  const heroSel = [
    { sel: ".hero__title-en > span:first-of-type", k: 0.05 },
    { sel: ".hero__title-en > em",                 k: 0.13 },
    { sel: ".hero__title-en > span:last-of-type",  k: -0.04 },
    { sel: ".hero__lede",                          k: 0.09 },
    { sel: ".hero__ctas",                          k: -0.07 },
  ];
  let heroLayers = [];
  function collectHeroLayers() {
    heroLayers = heroSel
      .map((s) => ({ el: document.querySelector(s.sel), k: s.k }))
      .filter((l) => l.el);
    heroLayers.forEach((l) => { l.el.style.willChange = "transform"; });
  }
  collectHeroLayers();
  // the title lines are rebuilt on language switch — re-collect them
  document.querySelectorAll(".lang-toggle__btn").forEach((b) => {
    b.addEventListener("click", () => requestAnimationFrame(collectHeroLayers));
  });
  let rafHero = 0;
  function applyHeroParallax() {
    const y = window.scrollY;
    heroLayers.forEach((l) => {
      l.el.style.translate = "0 " + (y * l.k).toFixed(1) + "px";
    });
    rafHero = 0;
  }
  window.addEventListener(
    "scroll",
    () => { if (!rafHero) rafHero = requestAnimationFrame(applyHeroParallax); },
    { passive: true }
  );
  applyHeroParallax();
})();
