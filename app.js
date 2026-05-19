// cc-bot showcase — vanilla JS for reveal-on-scroll, copy buttons,
// soft cursor glow, per-element reveal delays, and EN/zh-CN i18n.
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 0) i18n ----------------------------------------------------------------
  // Code blocks, command names and identifiers stay English in both modes.

  // cc-bot version — single source of truth for every version string on the
  // page. Mirror of WaterTian/cc-bot (.claude-plugin/plugin.json). Bump this
  // one line only; the eyebrow and footer strings below interpolate it.
  const VERSION = "0.1.14";

  const translations = {
    "nav.bot":           { en: "Bot",            zh: "机器人" },
    "nav.pet":           { en: "Desktop pet",    zh: "桌宠" },
    "nav.setup":         { en: "Setup",          zh: "接入" },

    "hero.eyebrow":      { en: `v${VERSION} · Local-first · MIT`,
                           zh: `v${VERSION} · 本地优先 · MIT` },
    "hero.titleEn":      {
      en: `<span data-reveal data-reveal-delay="0">Group chat</span>
           <em data-reveal data-reveal-delay="120">「Local Agent」</em>
           <span data-reveal data-reveal-delay="240">Desktop pet</span>`,
      zh: `<span data-reveal data-reveal-delay="0">群里聊天</span>
           <em data-reveal data-reveal-delay="120">「Local Agent」</em>
           <span data-reveal data-reveal-delay="240">桌面宠物</span>`
    },
    "hero.lede":         {
      en: "sintbot is a platform: <code>cc-bot</code> puts an AI agent in your Slack or Lark group — Claude Code runs on your laptop — and sends a desktop pet to watch the project and work beside you.",
      zh: "sintbot 是一个平台：<code>cc-bot</code> 把一个 AI agent 接进你的飞书/Slack 群 —— Claude Code 跑在你本机 —— 派一只桌宠盯着项目、陪你工作。"
    },
    "hero.cta.primary":   { en: "Meet sintbot", zh: "认识 sintbot" },

    "what.kicker":   { en: "Platform", zh: "平台" },
    "what.h":        { en: `What <em>sintbot</em> is.`, zh: `<em>sintbot</em> 是什么。` },
    "what.lede":     {
      en: "Local-first, MIT, no runtime. sintbot lives in the group chat your team already uses.",
      zh: "本地优先、MIT、无外部运行时。sintbot 就长在团队本来就在用的群聊里。"
    },
    "what.bot.title":{ en: "Multi-model group bot", zh: "多模型群聊机器人" },
    "what.bot.body": {
      en: `Drop an AI agent into a Slack / Lark channel — mention it, it works. <code>cc-bot</code> is the Claude Code edition, live today.`,
      zh: `把一个 AI agent 接进飞书 / Slack 群，mention 一下就开干。<code>cc-bot</code> 是 Claude Code 版，已上线。`
    },
    "what.bot.link": { en: "See the bot →", zh: "看机器人 →" },
    "what.pet.title":{ en: "Desktop pet", zh: "桌宠" },
    "what.pet.body": {
      en: "A creature on every teammate's desktop — it listens to the channel, cares about the project, and works beside you with a personality.",
      zh: "人手一只趴桌面的虚拟形象，旁听群聊、关心项目，有性格有情绪陪你工作。"
    },
    "what.pet.link": { en: "See the pet →", zh: "看桌宠 →" },

    "bot.kicker": { en: "Pillar ①", zh: "支柱 ①" },
    "bot.h":      { en: "Put an AI agent in the channel.", zh: "把 AI agent 接进群。" },
    "bot.lede":   {
      en: "The bot binds one AI agent into a Slack / Lark group — mention it, and the agent reads the intent, does the work and replies, all on your own machine.",
      zh: "机器人的活儿，是把一个 AI agent 绑进飞书 / Slack 群 —— 群友 mention 一下，agent 在你本机读意图、干活、回贴。"
    },
    "bot.slot.live":    { en: "cc-bot · live", zh: "cc-bot · 已上线" },
    "bot.slot.other":   { en: "Other AI agents", zh: "其他 AI agent" },
    "bot.slot.planned": { en: "planned", zh: "规划中" },
    "bot.bridge": {
      en: "Below is cc-bot — the full Claude Code edition.",
      zh: "下面是 cc-bot —— Claude Code 版的完整能力。"
    },

    "pet.kicker": { en: "Pillar ②", zh: "支柱 ②" },
    "pet.h":      { en: "Give the AI a form.", zh: "给 AI 一个形象。" },
    "pet.lede":   {
      en: "cc-bot works in the channel, but it has no face. The desktop pet is that face — a small creature on your desktop that watches the channel, cares about the project, and keeps you company with a mood.",
      zh: "cc-bot 在群里干活，但它没有脸。桌宠就是那张脸 —— 一只趴在你桌面的小生物，旁听群、关心项目、有情绪地陪你。"
    },
    "pet.1.title": { en: "One each", zh: "人手一只" },
    "pet.1.body":  {
      en: "Every teammate has their own creature on their own desktop — same channel, each their own view.",
      zh: "每个群友桌面都有自己的一只，同一个群、各自的视角。"
    },
    "pet.2.title": { en: "Listens to the channel", zh: "旁听群聊" },
    "pet.2.body":  {
      en: "Wired live into Slack / Lark — whatever happens in the channel, it knows.",
      zh: "实时接飞书 / Slack，群里发生什么它都知道。"
    },
    "pet.3.title": { en: "Acts out the state", zh: "演开发状态" },
    "pet.3.body":  {
      en: "cc-bot compiling, deploying, erroring — the pet plays it out in expression and motion.",
      zh: "cc-bot 编译 / 部署 / 报错，它用表情动作演出来。"
    },
    "pet.4.title": { en: "Has a personality", zh: "有性格有情绪" },
    "pet.4.body":  {
      en: "Not a status light — it answers messages, has moods and a temper, a partner that works beside you.",
      zh: "不只是状态灯 —— 会回应消息、有脾气、有情绪，是陪你工作的伙伴。"
    },
    "pet.close":  {
      en: "Give that AI dev teammate a face that moves and answers back.",
      zh: "让团队那位 AI 开发同事，有一张会动、会回应的脸。"
    },
    "pet.state.compiling": { en: "Compiling", zh: "编译中" },
    "pet.state.focus":     { en: "focused",   zh: "专注" },
    "pet.state.deployed":  { en: "Deployed",  zh: "部署成功" },
    "pet.state.happy":     { en: "delighted", zh: "雀跃" },
    "pet.state.error":     { en: "Error",     zh: "报错" },
    "pet.state.alert":     { en: "alarmed",   zh: "警觉" },
    "pet.state.idle":      { en: "Idle",      zh: "空闲" },
    "pet.state.lazy":      { en: "lazing",    zh: "慵懒" },

    "chat.user.name": { en: "Lin · PM", zh: "Lin · 产品" },
    "chat.msg1": {
      en: "@cc-bot signup is throwing 500 on staging — can you triage?",
      zh: "@cc-bot 预发 signup 报 500，帮忙看下？"
    },
    "chat.msg2": {
      en: `On it. Missing <code>await</code> on <code>hashPassword()</code>. Opened <a href="#" onclick="return false">PR #482</a>. <span class="chat__pill">slot · debug</span>`,
      zh: `在查。<code>hashPassword()</code> 漏了 <code>await</code>，已开 <a href="#" onclick="return false">PR #482</a>。<span class="chat__pill">slot · debug</span>`
    },
    "chat.msg3": { en: "ship to staging when CI is green", zh: "CI 通过后发预发" },
    "chat.msg4": {
      en: `✓ merged · staging 1m 47s · 12/12 smoke passed. <a href="#" onclick="return false">build log</a>`,
      zh: `✓ 已合并 · 预发耗时 1m 47s · 12/12 冒烟通过。<a href="#" onclick="return false">构建日志</a>`
    },

    "scenarios.kicker": { en: "①·01 — In your workspace", zh: "①·01 — 在你的工作区里" },
    "scenarios.h": {
      en: `Where <em>cc-bot</em> earns its keep.`,
      zh: `<em>cc-bot</em> 真正发力的地方。`
    },
    "scenarios.lede": {
      en: "Six channels, six jobs. Ask in chat, get an answer, keep working.",
      zh: "六个频道、六种活儿。群里问一句，拿到答案，继续干。"
    },

    "scenarios.1.title": { en: "PM drops a screenshot, cc-bot opens a PR.", zh: "产品丢张截图，cc-bot 开 PR。" },
    "scenarios.1.scene": {
      en: `Maya pastes a 500 screenshot into <code>#bugs</code>.`,
      zh: `Maya 在 <code>#bugs</code> 贴了张 500 报错截图。`
    },
    "scenarios.1.act": {
      en: "Bot reads the image, greps the repo, finds a stale migration, opens the PR, replies with the diff.",
      zh: "Bot 读图、grep 代码库、定位到一条过期 migration，开 PR 并把 diff 回到原帖。"
    },
    "scenarios.1.win": {
      en: `<i>Why it wins:</i> screenshot, fix, PR — one thread.`,
      zh: `<i>为什么有效：</i>截图、修复、PR 都在同一条消息线里。`
    },

    "scenarios.2.title": { en: "Solo dev ships from the channel.", zh: "独立开发者从频道直接发布。" },
    "scenarios.2.scene": {
      en: `You type "ship to prod" into <code>#deploys</code>.`,
      zh: `你在 <code>#deploys</code> 里发「ship to prod」。`
    },
    "scenarios.2.act": {
      en: `<code>deploy_prod</code> is <code>admin-confirm</code> — bot waits for "yes", deploys, posts the version tag.`,
      zh: `<code>deploy_prod</code> 标记为 <code>admin-confirm</code>——bot 等你回「yes」，执行部署，回贴版本号。`
    },
    "scenarios.2.win": {
      en: `<i>Why it wins:</i> no SSH, no dashboard, full audit trail.`,
      zh: `<i>为什么有效：</i>不开 SSH、不切控制台，Slack 里就有完整审计。`
    },

    "scenarios.3.title": { en: "Status without pinging the team.", zh: "不打扰团队也能拿到进度。" },
    "scenarios.3.scene": {
      en: `PM asks "where are we on Feature X?" in <code>#product</code>.`,
      zh: `产品在 <code>#product</code> 问「Feature X 进度如何」。`
    },
    "scenarios.3.act": {
      en: "Bot reads the progress doc, cross-refs recent commits, posts a tidy bullet list.",
      zh: "Bot 读进度文档、对照最近提交，回一份简洁的清单。"
    },
    "scenarios.3.win": {
      en: `<i>Why it wins:</i> engineer keeps flow, PM gets the answer in 20s.`,
      zh: `<i>为什么有效：</i>工程师不被打断，产品 20 秒拿到答案。`
    },

    "scenarios.4.title": { en: "Standup that writes itself.", zh: "自己写自己的日报。" },
    "scenarios.4.scene": {
      en: `At 09:30 a prompt drops in <code>#standup</code>.`,
      zh: `09:30，<code>#standup</code> 自动落下一条提问。`
    },
    "scenarios.4.act": {
      en: `Bot diffs 24h of <code>git log</code>, posts three lines per repo with authors linked.`,
      zh: `Bot 取 24 小时的 <code>git log</code>，每个仓库回三行，作者直接 @。`
    },
    "scenarios.4.win": {
      en: `<i>Why it wins:</i> happens whether or not humans show up.`,
      zh: `<i>为什么有效：</i>人没到，日报照样在。`
    },

    "scenarios.5.title": { en: "On-call gets a triage, not just an alert.", zh: "值班拿到的是分析，不只是告警。" },
    "scenarios.5.scene": {
      en: "Datadog fires a latency alert at 02:14.",
      zh: "Datadog 在凌晨 02:14 触发延迟告警。"
    },
    "scenarios.5.act": {
      en: `Bot queries logs via MCP, threads a probable cause: "p95 spike correlates with the new <code>orders</code> reindex."`,
      zh: `Bot 经由 MCP 查日志，给出可疑原因：「p95 飙升与新的 <code>orders</code> 重建索引相关」。`
    },
    "scenarios.5.win": {
      en: `<i>Why it wins:</i> on-call wakes to a starting point, not a mystery.`,
      zh: `<i>为什么有效：</i>值班醒来看到的是起点，不是谜题。`
    },

    "scenarios.6.title": { en: "Three devs, three agents — same channel, no clash.", zh: "三个人同时指挥 cc-bot，三个分身并行不打架。" },
    "scenarios.6.scene": {
      en: `Lin asks for a <code>rate-limit</code> PR, Maya wants a hero image regen, Kai ships docs to staging — all in <code>#ship-room</code> within a minute.`,
      zh: `Lin 让 bot 开 <code>rate-limit</code> 的 PR，Maya 要重出营销 hero 图，Kai 把文档推到预发——三条消息几乎同时落在 <code>#ship-room</code>。`
    },
    "scenarios.6.act": {
      en: "Each request spawns its own Claude Code session under the slot scheduler. Lin's session writes the PR. Maya's dispatches to Nano Banana for the image. Kai's runs the deploy script. HUD lights three lanes side by side.",
      zh: "每条请求都开一个独立的 Claude Code 会话，由 slot 调度器并行托管。Lin 的会话写 PR；Maya 的会话派给 Nano Banana 出图；Kai 的会话跑部署脚本。HUD 上三条 lane 同时亮。"
    },
    "scenarios.6.win": {
      en: `<i>Why it wins:</i> one project, many hands, zero conflict.`,
      zh: `<i>为什么有效：</i>一个项目，多人并行，互不踩脚。`
    },

    "cap.kicker": { en: "①·03 — Capabilities", zh: "①·03 — 能力" },
    "cap.h":      { en: "Seven muscles, one bot.", zh: "壹个 bot，柒块肌肉。" },

    "local.kicker": { en: "①·02 — On your machine", zh: "①·02 — 跑在你机器上" },
    "local.h":      { en: "Your laptop is the agent.", zh: "你的电脑就是 Agent。" },
    "local.lede":   {
      en: "Slack-native, fully local. cc-bot binds your shell to your IM — every command runs on your own hardware with your own credentials, then writes back to the chat.",
      zh: "原生 Slack，全程本地。cc-bot 把你的 shell 绑到 IM——每条指令都用你自己的凭证、在你自己的硬件上执行，结果再写回聊天里。"
    },
    "local.1.title": { en: "Yours, end-to-end.", zh: "全程都是你的。" },
    "local.1.body":  {
      en: "Code, tokens, SSH keys, git remotes — nothing leaves the machine. The IM platform sees the command you typed; everything else stays on disk.",
      zh: "代码、token、SSH key、git remote——什么都不出本机。IM 平台只看到你打的那一行命令，其他全部留在磁盘上。"
    },
    "local.2.title": { en: "Anything you can type, the bot can type.", zh: "你能敲的，bot 也能敲。" },
    "local.2.body":  {
      en: "File system, installed CLIs, the VPN-only Jenkins box, the private mirror behind the firewall. If your terminal reaches it, cc-bot reaches it.",
      zh: "文件系统、本机 CLI、VPN-only 的 Jenkins、防火墙后的私有镜像。终端能到的地方，cc-bot 都能到。"
    },
    "local.3.title": { en: "Built for the codebases SaaS forgot.", zh: "为 SaaS 够不着的老项目而生。" },
    "local.3.body":  {
      en: "Pre-2020 monorepos, SSH-only build boxes, internal Gerrit, the legacy PHP repo nobody wants to touch. SaaS agents need a clean GitHub repo; cc-bot doesn't.",
      zh: "Pre-2020 的 monorepo、SSH-only 构建机、内部 Gerrit、没人想碰的老 PHP 仓库。SaaS bot 要一个干净的 GitHub 仓库；cc-bot 不要。"
    },

    "cap.1.title": { en: "Slack-native, IM-agnostic", zh: "原生 Slack，IM 无关" },
    "cap.1.body":  {
      en: `Socket Mode push — no public webhook, works behind firewalls. The same <code>IMAdapter</code> powers Lark. The next adapter is one file.`,
      zh: `Socket Mode 推送，无需公网 webhook，能穿透防火墙。同一套 <code>IMAdapter</code> 也支撑飞书，下一个接入只是新增一个文件。`
    },
    "cap.2.title": { en: "Defensive delivery", zh: "防御式投递" },
    "cap.2.body":  {
      en: "Socket Mode push, dedupe ledger, main-busy queue. Every message delivered exactly once — even when your terminal is mid-edit.",
      zh: "Socket Mode 推送 + dedupe ledger + 主窗口忙时排队。每条消息恰好一次送达，哪怕你正在敲代码。"
    },
    "cap.3.title": { en: "Multi-session scheduling", zh: "多会话调度" },
    "cap.3.body":  {
      en: "Slots and tags turn parallel Claude Code sessions into a polite queue. Conflicts resolved by config, not chance.",
      zh: "slot 与 tag 把并行的 Claude Code 会话排成有序队列。冲突由配置决定，不靠运气。"
    },
    "cap.4.title": { en: "HUD status broadcast", zh: "HUD 状态广播" },
    "cap.4.body":  {
      en: "The statusline goes live: which agents are busy, which slots are free, last thread. Terminal and Slack agree.",
      zh: "状态栏直播：哪个 Agent 在忙、哪些 slot 空闲、最近一条消息。终端和 Slack 看到的是同一件事。"
    },
    "cap.5.title": { en: "Three-tier permission matrix", zh: "三级权限矩阵" },
    "cap.5.body":  {
      en: "Public reads, admin-auto writes, admin-confirm for the scary ones. Tag the intent once; the bot enforces it forever.",
      zh: "public 读，admin-auto 写，admin-confirm 兜底。intent 标一次，bot 永远照章办事。"
    },
    "cap.6.title": { en: "Main-window priority", zh: "主窗口优先" },
    "cap.6.body":  {
      en: `A <code>UserPromptSubmit</code> hook lets the dev at the keyboard preempt any background task. Focused — bot waits. Away — it works.`,
      zh: `<code>UserPromptSubmit</code> 钩子让正在敲键盘的开发者随时抢占后台任务。你在敲，bot 等；你走开，bot 干活。`
    },
    "cap.7.title": { en: "Claude Code at the helm", zh: "Claude Code 主脑，专家协作" },
    "cap.7.body":  {
      en: `Claude Code is the main brain. It reads every intent and either writes the work itself (diffs, PRs) or dispatches to a specialist: Gemini for UI, Nano Banana for design, Seedance for video, DeepSeek for heavy reasoning. Results stitch back into the thread.`,
      zh: `Claude Code 是主脑。每条意图它先接住，能自己干的（diff、PR）自己写；需要换脑子时派给专家：Gemini 做 UI、Nano Banana 设计、Seedance 视频、DeepSeek 重推理。结果再拼回原帖。`
    },

    "adapter.kicker": { en: "①·04 — Engineering note", zh: "①·04 — 工程笔记" },
    "adapter.h": {
      en: `One <em>IMAdapter</em>, many group chats.`,
      zh: `一个 <em>IMAdapter</em>，所有群聊。`
    },
    "adapter.p1": {
      en: `<code>adapters/base.js</code> defines the contract. Each IM is one file that fulfils it. Slack and Lark ship today; Discord or Teams is a weekend.`,
      zh: `<code>adapters/base.js</code> 定义契约，每个 IM 就是一个实现文件。Slack 与飞书已发布；Discord、Teams 是一个周末的事。`
    },
    "adapter.p2": {
      en: `Runtime reads <code>profile.im.type</code>, instantiates the adapter, and the rest of the pipeline never knows which IM it's talking to.`,
      zh: `运行时读取 <code>profile.im.type</code>，加载对应适配器，后续管线完全不知道自己在跟哪个 IM 说话。`
    },

    "arch.kicker": { en: "①·05 — Architecture", zh: "①·05 — 架构" },
    "arch.h":      { en: "A small idea, drawn carefully.", zh: "一个小想法，画得仔细。" },
    "arch.lede":   {
      en: "A thin pipeline. Events in via Socket Mode (Lark polls HTTP). Dedupe ledger guarantees exactly-once. Scheduler hands the message to Claude Code under the right permission tier; Claude Code answers itself or dispatches to a specialist (Gemini · Nano Banana · Seedance · DeepSeek) as the intent demands. Result flows back to channel and HUD together.",
      zh: "一条很薄的管线。事件经 Socket Mode 进入（飞书走 HTTP 轮询），去重账本保证只投一次。调度器在对应权限层把消息交给 Claude Code；Claude Code 自己回，或按意图派给专家模型（Gemini · Nano Banana · Seedance · DeepSeek），结果同时流回频道和 HUD。"
    },
    "arch.col.im":         { en: "IM Layer",         zh: "IM 层" },
    "arch.col.im.note":    { en: "channels · threads", zh: "频道 · 消息线" },
    "arch.col.delivery":   { en: "Delivery",         zh: "投递" },
    "arch.delivery.poll":  { en: "short-poll fallback", zh: "短轮询兜底" },
    "arch.delivery.dedupe":{ en: "dedupe ledger",    zh: "去重账本" },
    "arch.delivery.note":  { en: "exactly-once delivery", zh: "恰好一次投递" },
    "arch.col.sched":      { en: "Scheduler",        zh: "调度器" },
    "arch.sched.matrix":   { en: "conflict matrix",  zh: "冲突矩阵" },
    "arch.sched.hook":     { en: "main-window hook", zh: "主窗口钩子" },
    "arch.sched.note":     { en: "permission tier check", zh: "权限层校验" },
    "arch.col.out":        { en: "Output",           zh: "输出" },
    "arch.out.session":    { en: "Claude Code session", zh: "Claude Code 会话" },
    "arch.out.reply":      { en: "channel reply",    zh: "频道回复" },
    "arch.out.note":       { en: "terminal + Slack agree", zh: "终端与 Slack 同步" },
    "arch.return":         { en: "return: status + result", zh: "返回：状态 + 结果" },
    "arch.caption":        {
      en: "Events flow left → right; status returns along the dotted path. Slack uses Socket Mode; Lark falls back to HTTP polling.",
      zh: "事件从左到右流动，状态沿虚线回流。Slack 走 Socket Mode，飞书使用 HTTP 轮询。"
    },

    "perm.h":            { en: "Permission matrix", zh: "权限矩阵" },
    "perm.col.tier":     { en: "Tier",              zh: "层级" },
    "perm.col.who":      { en: "Who can call",      zh: "可调用方" },
    "perm.col.confirm":  { en: "Confirmation",      zh: "确认" },
    "perm.col.intent":   { en: "Typical intent",    zh: "典型 intent" },
    "perm.row1.who":     { en: "any channel member", zh: "任何频道成员" },
    "perm.row1.confirm": { en: "none",              zh: "无" },
    "perm.row2.confirm": { en: "none",              zh: "无" },
    "perm.row3.confirm": { en: `reply <em>yes</em>`, zh: `回复 <em>yes</em>` },

    "install.kicker": { en: "①·06 — Slack setup", zh: "①·06 — Slack 接入" },
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

    "cta.h": { en: "Ship from where the team already talks.", zh: "在团队本来就在聊的地方发布。" },
    "cta.p": {
      en: `sintbot is MIT and runtime-free. cc-bot's Slack &amp; Lark adapters are live on <code>main</code>; the desktop pet is on the way.`,
      zh: `sintbot 采用 MIT、无外部运行时。cc-bot 的 Slack 与飞书适配器已在 <code>main</code> 分支；桌宠在路上。`
    },
    "cta.repo": { en: "Open the repo", zh: "打开仓库" },

    "foot.tag":     { en: `v${VERSION} · MIT · Local-first · IM-agnostic`, zh: `v${VERSION} · MIT · 本地优先 · IM 无关` },
    "foot.meta":    {
      en: "sintbot showcase — rouserlab editorial pacing, the-field motion. Not affiliated with Slack, Lark, or Anthropic.",
      zh: "sintbot 展示站点 —— 节奏取自 rouserlab，动作取自 the-field。与 Slack、飞书、Anthropic 无任何隶属关系。"
    },

    "copy": { en: "copy", zh: "复制" },

    "totop.label": { en: "Back to top", zh: "返回顶部" }
  };

  const STORAGE_KEY = "cc_bot_site_lang";

  function pickInitialLang() {
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

  // 6) Analytics — GoatCounter custom events -----------------------------
  // The plain pageview is sent automatically by count.js. Below we add
  // intent-level events. count.js loads async; all events here fire on
  // user interaction or scroll, by which point window.goatcounter exists.
  function track(name, title) {
    if (window.goatcounter && typeof window.goatcounter.count === "function") {
      window.goatcounter.count({ path: name, title: title || name, event: true });
    }
  }

  // copy buttons — split by what was copied
  document.querySelectorAll(".copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy") || "";
      if (text.includes("/plugin install")) {
        track("copy-install", "Copy: install command");
      } else if (text.includes("display_information")) {
        track("copy-manifest", "Copy: Slack manifest");
      } else if (text.includes("/cc-bot:start")) {
        track("copy-start", "Copy: cc-bot:start");
      } else {
        track("copy-other", "Copy: other snippet");
      }
    });
  });

  // language toggle
  document.querySelectorAll(".lang-toggle__btn[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      track("lang-" + lang, "Lang switch: " + lang);
    });
  });

  // primary CTA — 'Meet sintbot'
  document.querySelectorAll('.btn--primary[href="#what"]').forEach((btn) => {
    btn.addEventListener("click", () => track("cta-meet", "CTA: Meet sintbot"));
  });

  // outbound GitHub links
  document.querySelectorAll('a[href*="github.com/WaterTian"]').forEach((a) => {
    a.addEventListener("click", () => track("github-click", "Outbound: GitHub"));
  });

  // pillar card clicks
  document.querySelectorAll('.pillar__link').forEach((a) => {
    a.addEventListener("click", () => track("pillar-click", "Pillar card: " + a.getAttribute("href")));
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
            track("section-" + id, "Section reached: " + id);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("main section[id]").forEach((s) => secObs.observe(s));
  }

  // 7) Logo-cycle — random crossfade of the bot characters ----------------
  // Each [data-logo-cycle] <img> is swapped for a two-layer span that fades
  // between random bot characters on its own independent timer.
  const cycleSlots = document.querySelectorAll("img[data-logo-cycle]");
  if (cycleSlots.length) {
    const COUNT = 12;
    const bots = [];
    for (let i = 1; i <= COUNT; i++) {
      bots.push("./assets/bot/bot-" + String(i).padStart(2, "0") + ".webp");
    }
    bots.forEach((s) => { const im = new Image(); im.src = s; }); // preload

    cycleSlots.forEach((orig) => {
      const span = document.createElement("span");
      span.className = "logo-cycle" + (orig.className ? " " + orig.className : "");
      if (orig.getAttribute("aria-hidden")) span.setAttribute("aria-hidden", "true");
      // class-less slots (nav / footer) keep their original icon height;
      // classed slots (hero pet, pet-state) are sized by their existing CSS.
      if (!orig.className) {
        const h = orig.getAttribute("height");
        if (h) span.style.height = h + "px";
      }
      const layerA = document.createElement("img");
      const layerB = document.createElement("img");
      layerA.className = layerB.className = "logo-cycle__layer";
      layerA.alt = layerB.alt = "";
      let shown = (Math.random() * COUNT) | 0;
      let queued = (shown + 1 + ((Math.random() * (COUNT - 1)) | 0)) % COUNT;
      layerA.src = bots[shown];
      layerB.src = bots[queued];
      layerA.style.opacity = "1";
      layerB.style.opacity = "0";
      span.append(layerA, layerB);
      orig.replaceWith(span);

      let front = layerA, back = layerB;
      function step() {
        back.style.opacity = "1";
        front.style.opacity = "0";
        shown = queued;
        const t = front; front = back; back = t;
        let n;
        do { n = (Math.random() * COUNT) | 0; } while (n === shown);
        queued = n;
        back.src = bots[n];
        schedule();
      }
      function schedule() {
        // wide, uneven interval so the 7 slots scatter unpredictably
        setTimeout(step, 4000 + Math.random() * 11000);
      }
      schedule();
    });
  }

  // 8) Hero parallax — staggered depth on the hero text while scrolling.
  // `translate` (standalone property) composes with the reveal's
  // `transform`. Each layer carries will-change so the browser keeps it
  // on its own compositor layer and caches the raster — including the
  // static per-layer blur (set in CSS) — so scrolling only re-composites
  // and never re-blurs: smooth, no jank.
  const heroSel = [
    { sel: ".hero__marquee",                       k: 0.2 },
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
