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
  // section and the JSON-LD softwareVersion. Mirror of the latest npm release;
  // scripts/check-version.mjs (daily workflow) fails when they drift apart.
  // Bump this one line only, then run scripts/build-zh.mjs.
  const VERSION = "1.3.0";

  const translations = {
  "meta.title": {
    "en": "SintBot — a coding assistant in your Feishu group",
    "zh": "SintBot —— 一群一项目，在自己的 Mac 上工作"
  },
  "meta.description": {
    "en": "Bind one Feishu group to a project on your Mac. SintBot 1.3.0 runs Codex tasks through its built-in core and brings the answer back to the group.",
    "zh": "一个飞书群绑定一个 Mac 上的项目，SintBot 1.3.0 通过内置核心运行 Codex 任务，把答复带回群聊。"
  },
  "meta.ogAlt": {
    "en": "SintBot 1.3.0 — macOS, Feishu and Codex",
    "zh": "SintBot 1.3.0 —— macOS、飞书与 Codex"
  },
  "nav.platforms": {
    "en": "Capabilities",
    "zh": "当前能力"
  },
  "nav.models": {
    "en": "Workflow",
    "zh": "工作流程"
  },
  "nav.design": {
    "en": "Permissions",
    "zh": "权限"
  },
  "nav.console": {
    "en": "FAQ",
    "zh": "常见问题"
  },
  "nav.setup": {
    "en": "Install",
    "zh": "安装"
  },
  "hero.eyebrow": {
    "en": "Built-in core · macOS · one Feishu group · Codex",
    "zh": "内置核心 · macOS · 飞书单群 · Codex"
  },
  "hero.titleEn": {
    "en": "<span data-reveal data-reveal-delay=\"0\">Say it in the group.</span>\n           <em data-reveal data-reveal-delay=\"120\">Your project gets to work.</em>\n           <span data-reveal data-reveal-delay=\"240\">On your own Mac.</span>",
    "zh": "<span class=\"zh-row\" data-reveal data-reveal-delay=\"0\"><span class=\"zh-big\">一群一项目</span><span class=\"visually-hidden\">，</span><span class=\"zh-note\"><span>一句话</span><span>就开工</span></span></span>\n           <span class=\"zh-row\" data-reveal data-reveal-delay=\"120\"><span class=\"zh-big\">任务本机做</span><span class=\"visually-hidden\">，</span><span class=\"zh-note\"><span>答复</span><span>回群</span></span></span>\n           <span class=\"zh-tail\" data-reveal data-reveal-delay=\"240\">在你自己的 Mac 上，由 Codex 处理</span>"
  },
  "hero.lede": {
    "en": "Bind a chat group to a project. Send a task in Feishu; <code>SintBot</code> runs Codex inside the project on your Mac and brings the answer back to the conversation. Version 1.3.0 includes the built-in core for one group, with foreground operation.",
    "zh": "一个聊天群绑定一个项目。在飞书群里发任务，<code>SintBot</code> 让 Codex 在你 Mac 上的项目里处理，再把答复带回群聊。1.3.0 内置核心支持单群，使用时保持前台运行。"
  },
  "hero.cta.primary": {
    "en": "See how it works",
    "zh": "看它怎么工作"
  },
  "hero.cta.plugin": {
    "en": "Project on GitHub",
    "zh": "GitHub 项目"
  },
  "plat.lark": {
    "en": "Feishu",
    "zh": "飞书"
  },
  "plat.trio": {
    "en": "macOS · Feishu · Codex",
    "zh": "macOS · 飞书 · Codex"
  },
  "mock.lark.title": {
    "en": "Project group",
    "zh": "项目群"
  },
  "mock.lark.kind": {
    "en": "example conversation",
    "zh": "示例对话"
  },
  "mock.lark.user": {
    "en": "You",
    "zh": "你"
  },
  "mock.lark.ask": {
    "en": "read the README and explain this project; do not change files",
    "zh": "读一下 README，告诉我项目是做什么的，先不要修改文件"
  },
  "mock.lark.state": {
    "en": "Example answer",
    "zh": "示例答复"
  },
  "mock.lark.l1": {
    "en": "Read README.md in the bound project",
    "zh": "读取绑定项目的 README.md"
  },
  "mock.lark.l2": {
    "en": "Summarize the project and its setup",
    "zh": "整理项目用途与启动步骤"
  },
  "mock.lark.l3": {
    "en": "No files changed",
    "zh": "未修改文件"
  },
  "mock.lark.b1": {
    "en": "README.md",
    "zh": "README.md"
  },
  "mock.lark.b2": {
    "en": "Read-only example",
    "zh": "只读示例"
  },
  "mock.eq": {
    "en": "one project",
    "zh": "同一个项目"
  },
  "mock.slack.working": {
    "en": "example",
    "zh": "示例"
  },
  "mock.slack.user": {
    "en": "Local project",
    "zh": "本机项目"
  },
  "mock.slack.ask": {
    "en": "The same task reaches Codex on your Mac.",
    "zh": "同一条任务，交给 Mac 上的 Codex。"
  },
  "mock.slack.ack": {
    "en": "Working in the bound project",
    "zh": "在绑定的项目里处理"
  },
  "mock.slack.thread": {
    "en": "Example · local execution",
    "zh": "示例 · 本机执行"
  },
  "mock.slack.progress": {
    "en": "Reading README.md",
    "zh": "读取 README.md"
  },
  "mock.slack.final": {
    "en": "The README describes a small web app, its files and local startup steps.",
    "zh": "README 描述了一个小型网页应用、文件结构和本地启动步骤。"
  },
  "mock.slack.b1": {
    "en": "Your Mac",
    "zh": "你的 Mac"
  },
  "mock.slack.b2": {
    "en": "Codex",
    "zh": "Codex"
  },
  "what.kicker": {
    "en": "What it is",
    "zh": "它是什么"
  },
  "what.h": {
    "en": "Your project, <em>in the group.</em>",
    "zh": "你的项目，<em>接进群聊。</em>"
  },
  "what.lede": {
    "en": "SintBot runs on your Mac and connects one Feishu group to one local project. A task in the group becomes a Codex turn in that project.",
    "zh": "SintBot 在你的 Mac 上运行，把一个飞书群连接到一个本机项目。群里发出的任务，成为这个项目里的 Codex 轮次。"
  },
  "what.bot.title": {
    "en": "A coding assistant for your project group",
    "zh": "项目群里的编码助手"
  },
  "what.bot.body": {
    "en": "<code>sintbot</code> connects the conversation to the working directory. The 1.3.0 package includes a built-in core and is distributed under PolyForm Shield 1.0.0. Start with a read-only task and the versioned installation guide.",
    "zh": "<code>sintbot</code> 把群聊与工作目录连接起来。1.3.0 安装包包含内置核心，按 PolyForm Shield 1.0.0 分发。按版本指南安装，从只读任务开始。"
  },
  "what.bot.link": {
    "en": "See the supported route →",
    "zh": "查看当前支持范围 →"
  },
  "facts.platforms": {
    "en": "supported operating system",
    "zh": "支持的运行系统"
  },
  "facts.runners": {
    "en": "local agent runner",
    "zh": "本机执行通道"
  },
  "facts.models": {
    "en": "Node.js required",
    "zh": "Node.js 版本要求"
  },
  "facts.projects": {
    "en": "project per group",
    "zh": "每个群绑定的项目"
  },
  "facts.redact": {
    "en": "Feishu group per instance",
    "zh": "每个实例接入的飞书群"
  },
  "facts.tests": {
    "en": "current release",
    "zh": "当前发行版本"
  },
  "plat.kicker": {
    "en": "01 · Capabilities",
    "zh": "01 · 当前能力"
  },
  "plat.h": {
    "en": "Mac, Feishu and Codex. <em>One working route.</em>",
    "zh": "Mac、飞书与 Codex，<em>接成一条路径。</em>"
  },
  "plat.lede": {
    "en": "The 1.3.0 built-in core supports macOS, one Feishu group and Codex. These three parts connect the conversation to your project; other routes will follow.",
    "zh": "1.3.0 内置核心支持 macOS、一个飞书群与 Codex。这三部分把对话连接到项目，更多使用方式将在后续完善。"
  },
  "plat.lark.h": {
    "en": "In a Feishu group",
    "zh": "在飞书群里"
  },
  "plat.lark.1.t": {
    "en": "One bound group",
    "zh": "一个绑定的群"
  },
  "plat.lark.1.b": {
    "en": "Connect one Feishu group to a local project.",
    "zh": "连接一个飞书群与本机项目。"
  },
  "plat.lark.2.t": {
    "en": "Tasks in the conversation",
    "zh": "在对话中派活"
  },
  "plat.lark.2.b": {
    "en": "Describe the work in the group you already use.",
    "zh": "在原来的群聊里说明要做的事。"
  },
  "plat.lark.3.t": {
    "en": "Replies return to the group",
    "zh": "答复回到群里"
  },
  "plat.lark.3.b": {
    "en": "Read the result in the same conversation.",
    "zh": "在同一段对话里查看结果。"
  },
  "plat.lark.4.t": {
    "en": "Feishu China edition",
    "zh": "飞书中国版"
  },
  "plat.lark.4.b": {
    "en": "Uses Feishu long-connection event delivery.",
    "zh": "使用飞书长连接接收事件。"
  },
  "plat.slack.h": {
    "en": "On your Mac",
    "zh": "在你的 Mac 上"
  },
  "plat.slack.1.t": {
    "en": "Local project directory",
    "zh": "本机项目目录"
  },
  "plat.slack.1.b": {
    "en": "Work happens in the configured project directory.",
    "zh": "任务在配置的项目目录里执行。"
  },
  "plat.slack.2.t": {
    "en": "Node.js 22 or later",
    "zh": "Node.js 22 及以上"
  },
  "plat.slack.2.b": {
    "en": "Prepare Node and an authenticated Codex first.",
    "zh": "先准备 Node 和已登录的 Codex。"
  },
  "plat.slack.3.t": {
    "en": "Separate installation",
    "zh": "独立安装"
  },
  "plat.slack.3.b": {
    "en": "The installer preserves existing global packages and services.",
    "zh": "安装器保留已有全局包和服务。"
  },
  "plat.slack.4.t": {
    "en": "Foreground operation",
    "zh": "前台运行"
  },
  "plat.slack.4.b": {
    "en": "Keep the terminal open while the group uses SintBot.",
    "zh": "群里使用时保持终端开启。"
  },
  "plat.wecom.h": {
    "en": "Through Codex",
    "zh": "由 Codex 处理"
  },
  "plat.wecom.1.t": {
    "en": "Codex message turns",
    "zh": "Codex 消息轮次"
  },
  "plat.wecom.1.b": {
    "en": "Each task is handed to the local Codex installation.",
    "zh": "任务交给本机安装的 Codex。"
  },
  "plat.wecom.2.t": {
    "en": "Read-only first",
    "zh": "从只读开始"
  },
  "plat.wecom.2.b": {
    "en": "The installation guide starts with read-only permissions.",
    "zh": "安装指南以只读权限开始。"
  },
  "plat.wecom.3.t": {
    "en": "Your configured model service",
    "zh": "你配置的模型服务"
  },
  "plat.wecom.3.b": {
    "en": "Codex uses its own account and model configuration.",
    "zh": "Codex 使用自身的账号与模型配置。"
  },
  "plat.wecom.4.t": {
    "en": "An answer in context",
    "zh": "带着项目上下文回复"
  },
  "plat.wecom.4.b": {
    "en": "Ask about the README, code or project structure.",
    "zh": "可以从 README、代码或项目结构问起。"
  },
  "plat.core.label": {
    "en": "1.3.0 scope",
    "zh": "1.3.0 范围"
  },
  "plat.core.1": {
    "en": "macOS",
    "zh": "macOS"
  },
  "plat.core.2": {
    "en": "one Feishu group",
    "zh": "一个飞书群"
  },
  "plat.core.3": {
    "en": "one local project",
    "zh": "一个本机项目"
  },
  "plat.core.4": {
    "en": "Codex",
    "zh": "Codex"
  },
  "plat.core.5": {
    "en": "built-in core",
    "zh": "内置核心"
  },
  "plat.core.6": {
    "en": "foreground operation",
    "zh": "前台运行"
  },
  "flow.kicker": {
    "en": "02 · How it works",
    "zh": "02 · 工作流程"
  },
  "flow.h": {
    "en": "From <em>one sentence</em> to a project task.",
    "zh": "从<em>一句话</em>，到项目里的任务。"
  },
  "flow.lede": {
    "en": "SintBot receives the group message, runs Codex in the bound project on your Mac and returns the answer. Feishu and the model service remain network services.",
    "zh": "SintBot 接收群消息，在 Mac 上的绑定项目里运行 Codex，再把答复带回群里。飞书和模型服务仍需要网络连接。"
  },
  "flow.return": {
    "en": "answer back to the group",
    "zh": "答复回到群聊"
  },
  "flow.col.group": {
    "en": "Feishu group",
    "zh": "飞书群"
  },
  "flow.group.note1": {
    "en": "send a project task",
    "zh": "发出项目任务"
  },
  "flow.group.note2": {
    "en": "one group · one project",
    "zh": "一个群 · 一个项目"
  },
  "flow.col.daemon": {
    "en": "SintBot · your Mac",
    "zh": "SintBot · 你的 Mac"
  },
  "flow.daemon.1": {
    "en": "built-in core",
    "zh": "内置核心"
  },
  "flow.daemon.2": {
    "en": "one group · one project",
    "zh": "一个群 · 一个项目"
  },
  "flow.daemon.3": {
    "en": "configured permissions",
    "zh": "配置的执行权限"
  },
  "flow.daemon.note1": {
    "en": "Feishu long connection",
    "zh": "飞书长连接"
  },
  "flow.daemon.note2": {
    "en": "foreground operation",
    "zh": "前台运行"
  },
  "flow.col.runner": {
    "en": "Agent runner",
    "zh": "执行通道"
  },
  "flow.runner.note1": {
    "en": "in the project directory",
    "zh": "在项目目录里执行"
  },
  "flow.runner.note2": {
    "en": "installed and signed in",
    "zh": "本机安装并登录"
  },
  "flow.col.model": {
    "en": "Model service",
    "zh": "模型服务"
  },
  "flow.model.note1": {
    "en": "uses Codex configuration",
    "zh": "使用 Codex 配置"
  },
  "flow.model.note2": {
    "en": "provider policies apply",
    "zh": "适用服务商政策"
  },
  "flow.side.console": {
    "en": "configuration",
    "zh": "本机配置"
  },
  "flow.side.dir": {
    "en": "local project directory",
    "zh": "本机项目目录"
  },
  "flow.side.design": {
    "en": "persistent state",
    "zh": "持久运行状态"
  },
  "flow.side.design.note": {
    "en": "preserve state on failure",
    "zh": "失败时保留状态"
  },
  "flow.caption": {
    "en": "Group → SintBot → Codex → model service. The answer returns to the group; configuration, project files and runtime state stay on the Mac. Model requests follow your Codex configuration.",
    "zh": "群聊 → SintBot → Codex → 模型服务。答复回到群里，配置、项目文件和运行状态保留在 Mac 上；模型请求遵循你的 Codex 配置。"
  },
  "gov.kicker": {
    "en": "03 · Permissions",
    "zh": "03 · 权限"
  },
  "gov.h": {
    "en": "Read-only <em>for your first task.</em>",
    "zh": "第一条任务，<em>从只读开始。</em>"
  },
  "gov.lede": {
    "en": "Use the installation guide’s read-only configuration for the first reply. Keep the execution scope and account permissions explicit.",
    "zh": "先用安装指南中的只读配置验证第一条答复，明确任务范围与账号权限。"
  },
  "gov.t1.title": {
    "en": "Start read-only",
    "zh": "先用只读权限"
  },
  "gov.t1.body": {
    "en": "Ask for the first line of the README before granting broader access.",
    "zh": "先让助手返回 README 第一行，再决定是否扩大权限。"
  },
  "gov.t2.title": {
    "en": "Choose the project",
    "zh": "指定项目范围"
  },
  "gov.t2.body": {
    "en": "Bind the one group to the existing project you want Codex to work in.",
    "zh": "把这一个群绑定到希望 Codex 处理的现有项目。"
  },
  "gov.t3.title": {
    "en": "Keep credentials local",
    "zh": "凭据在本机配置"
  },
  "gov.t3.body": {
    "en": "Enter the Feishu app credentials locally. Do not post secrets to the group or commit them to a repository.",
    "zh": "在本机填写飞书应用凭据，不把密钥发到群里或提交到仓库。"
  },
  "plugin.kicker": {
    "en": "04 · Install",
    "zh": "04 · 安装"
  },
  "plugin.h": {
    "en": "Install SintBot <em>on your Mac.</em>",
    "zh": "安装 SintBot，<em>把项目接进群里。</em>"
  },
  "plugin.lede": {
    "en": "The 1.3.0 package includes the built-in core. Prepare macOS, Node.js 22 or later and a working, signed-in <code>codex</code>. The installer does not install Node or sign in to Codex.",
    "zh": "1.3.0 安装包包含内置核心。需要 macOS、Node.js 22 及以上，以及可正常使用且已登录的 <code>codex</code>。安装器不会安装 Node 或代为登录 Codex。"
  },
  "plugin.meta.kind": {
    "en": "npm · sintbot v1.3.0",
    "zh": "npm · sintbot v1.3.0"
  },
  "install.h": {
    "en": "From your Mac to the group, in four steps.",
    "zh": "从你的 Mac 到群聊，分四步接入。"
  },
  "install.lede": {
    "en": "Use the <a class=\"install-guide\" href=\"https://github.com/sintlab/sintbot/blob/v1.3.0/docs/install.md\">1.3.0 installation guide</a> for the full configuration and exact startup commands.",
    "zh": "完整配置和准确的启动步骤见 <a class=\"install-guide\" href=\"https://github.com/sintlab/sintbot/blob/v1.3.0/docs/zh-CN/install.md\">1.3.0 安装指南</a>。"
  },
  "install.quick": {
    "en": "Download the installer, preview its actions with <code>--dry-run</code>, then run the same file. It installs into a separate release directory.",
    "zh": "先下载安装脚本，用 <code>--dry-run</code> 预览操作，再运行同一文件。程序安装到独立版本目录。"
  },
  "install.1.title": {
    "en": "Prepare your Mac",
    "zh": "准备运行环境"
  },
  "install.1.after": {
    "en": "Confirm Node.js 22+ and a working, authenticated Codex. Keep your current account data.",
    "zh": "确认 Node.js 22 及以上，以及已安装并登录的 Codex，保留原有账号数据。"
  },
  "install.2.title": {
    "en": "Install separately",
    "zh": "独立安装"
  },
  "install.2.after": {
    "en": "Run the commands above. Existing global packages, configuration and services are left untouched.",
    "zh": "运行上方命令；已有全局包、配置和服务保持不变。"
  },
  "install.3.title": {
    "en": "Connect one group",
    "zh": "连接一个群"
  },
  "install.3.after": {
    "en": "Create a Feishu custom app, configure its long connection and bind one group to an existing project. Follow the versioned guide.",
    "zh": "创建飞书自建应用，配置长连接，将一个群绑定到现有项目，按版本指南完成配置。"
  },
  "install.4.title": {
    "en": "Start and try a message",
    "zh": "启动并验证消息"
  },
  "install.4.after": {
    "en": "Initialize fresh state only for a new installation, then start in the foreground. Keep the terminal open and verify a read-only reply.",
    "zh": "仅新安装初始化全新状态，然后在前台启动。保持终端开启，验证一条只读答复。"
  },
  "faq.kicker": {
    "en": "05 · FAQ",
    "zh": "05 · 常见问题"
  },
  "faq.h": {
    "en": "Asked often, <em>answered plainly.</em>",
    "zh": "常被问到的，<em>直接回答。</em>"
  },
  "faq.1.q": {
    "en": "What is SintBot?",
    "zh": "SintBot 是什么？"
  },
  "faq.1.a": {
    "en": "A coding assistant that connects one Feishu group to a local project. In 1.3.0, Codex works on your Mac and returns its answer to the group.",
    "zh": "连接一个飞书群与本机项目的编码助手。1.3.0 由 Codex 在你的 Mac 上处理任务，再把答复带回群里。"
  },
  "faq.2.q": {
    "en": "What does 1.3.0 support?",
    "zh": "1.3.0 支持哪些使用方式？"
  },
  "faq.2.a": {
    "en": "macOS, Node.js 22+, one Feishu group and Codex, running in the foreground. Multiple groups, other model routes, Slack, WeCom, whiteboards, the console, schedules and other operating systems are not included.",
    "zh": "macOS、Node.js 22 及以上、一个飞书群与 Codex，使用时在前台运行。多群、其他模型通道、Slack、企业微信、画板、控制台、定时与其他操作系统不包含在本版中。"
  },
  "faq.3.q": {
    "en": "Can I upgrade my existing installation?",
    "zh": "现有安装能直接升级吗？"
  },
  "faq.3.a": {
    "en": "Keep your previous version if you depend on capabilities outside this release. Installing a separate package does not migrate existing state; wait for a compatible migration procedure.",
    "zh": "依赖本版范围之外的能力时，请保留原版本。单独安装程序不会迁移已有状态，请等待兼容的迁移方案。"
  },
  "faq.4.q": {
    "en": "Does everything work offline?",
    "zh": "全部处理都在离线环境完成吗？"
  },
  "faq.4.a": {
    "en": "No. SintBot and the project run on your Mac, but Feishu and your configured model service require a network connection. Model requests follow Codex configuration and the service provider’s data policy.",
    "zh": "不是。SintBot 和项目在本机运行，飞书及配置的模型服务仍需联网。模型请求遵循 Codex 配置及服务商的数据政策。"
  },
  "faq.5.q": {
    "en": "What do I need to install it?",
    "zh": "安装需要准备什么？"
  },
  "faq.5.a": {
    "en": "A Mac with Node.js 22+, an installed and signed-in Codex, and a Feishu application configured according to the versioned guide. Use Feishu China edition; international Lark is not supported.",
    "zh": "一台已安装 Node.js 22 及以上的 Mac、已安装并登录的 Codex，以及按版本指南配置的飞书应用。使用飞书中国版，暂不支持国际版 Lark。"
  },
  "faq.6.q": {
    "en": "How is SintBot licensed?",
    "zh": "SintBot 使用什么许可证？"
  },
  "faq.6.a": {
    "en": "SintBot is distributed under PolyForm Shield 1.0.0. The package includes its built-in core, the license and third-party notices. Model service access is configured separately.",
    "zh": "SintBot 按 PolyForm Shield 1.0.0 分发。安装包包含内置核心、许可证与第三方声明，模型服务需要另行配置。"
  },
  "cta.h": {
    "en": "Put the project in the group.",
    "zh": "把项目，接进群里。"
  },
  "cta.p": {
    "en": "Start with one Feishu group and one project on your Mac. Follow the 1.3.0 guide and try a read-only task.",
    "zh": "从一个飞书群、一个 Mac 上的项目开始。按 1.3.0 指南接入，先试一条只读任务。"
  },
  "cta.see": {
    "en": "See how it works",
    "zh": "看它怎么工作"
  },
  "cta.plugin": {
    "en": "Project on GitHub",
    "zh": "GitHub 项目"
  },
  "foot.tag": {
    "en": "Built-in core · macOS · Feishu · Codex",
    "zh": "内置核心 · macOS · 飞书 · Codex"
  },
  "foot.by": {
    "en": "By WaterTian · A SintLab project",
    "zh": "作者 WaterTian · SintLab 项目"
  },
  "foot.privacy": {
    "en": "Privacy Policy",
    "zh": "隐私政策"
  },
  "foot.terms": {
    "en": "Terms of Service",
    "zh": "服务条款"
  },
  "foot.meta": {
    "en": "Not affiliated with Feishu, OpenAI or any other provider named here. Product names and logos belong to their respective owners.",
    "zh": "与飞书、OpenAI 或其他提及的服务商无隶属关系，产品名称及标志归其各自所有者。"
  },
  "copy": {
    "en": "copy",
    "zh": "复制"
  },
  "totop.label": {
    "en": "Back to top",
    "zh": "返回顶部"
  },
  "skip": {
    "en": "Skip to content",
    "zh": "跳到正文"
  },
  "flow.group.task": {
    "en": "Task",
    "zh": "任务消息"
  },
  "flow.group.reply": {
    "en": "Answer",
    "zh": "处理答复"
  },
  "flow.model.1": {
    "en": "Configured model",
    "zh": "配置的模型"
  },
  "flow.model.2": {
    "en": "Codex account",
    "zh": "Codex 账号"
  },
  "flow.model.3": {
    "en": "Network connection",
    "zh": "网络连接"
  },
  "upgrade.kicker": {
    "en": "Existing installations",
    "zh": "已有安装"
  },
  "upgrade.h": {
    "en": "Keep your current workflow.",
    "zh": "保留现有工作方式。"
  },
  "upgrade.body": {
    "en": "If you use multiple groups, Claude, Slack, WeCom, whiteboards, the console or schedules, keep your current version. These capabilities and Linux/Windows support are outside 1.3.0; compatible migration and broader support will follow.",
    "zh": "如果你正在使用多群、Claude、Slack、企业微信、画板、控制台或定时任务，请保留原版本。这些能力及 Linux/Windows 支持不在 1.3.0 范围内，兼容迁移与更多支持将继续完善。"
  },
  "install.guide": {
    "en": "Read the 1.3.0 guide",
    "zh": "阅读 1.3.0 指南"
  },
  "copy.ok": {
    "en": "copied",
    "zh": "已复制"
  },
  "copy.fail": {
    "en": "Select and copy manually",
    "zh": "请选中命令手动复制"
  }
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
    const description = translations["meta.description"][lang];
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((meta) => meta.content = description);
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => meta.content = translations["meta.title"][lang]);
    document.querySelectorAll(".install-guide").forEach((link) => { link.href = `https://github.com/sintlab/sintbot/blob/v1.3.0/docs/${lang === "zh" ? "zh-CN/" : ""}install.md`; });

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
      const active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
      b.setAttribute("role", "button");
      b.href = (b.getAttribute("data-lang") === "zh" ? "/zh/" : "/") + window.location.hash;
    });

    if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ } }
  }

  const initialLang = pickInitialLang();
  applyLang(initialLang, false); // only an explicit toggle click is remembered

  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const target = btn.getAttribute("data-lang");
      if (target !== "en" && target !== "zh") return;
      forcedByQuery = false; // an explicit click is a real choice: persist it and move the URL
      applyLang(target, true);
    });
  });

  document.querySelectorAll(".lang-toggle__btn").forEach((button) => {
    button.addEventListener("keydown", (event) => {
      if (event.key === " ") { event.preventDefault(); button.click(); }
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
    document.documentElement.classList.add("reveal-ready");
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
  // Keep the original pointer-follow effect only when reduced motion is not requested.
  // (any-pointer: fine) instead of (pointer: fine) covers touch-hybrid laptops.
  if (!prefersReducedMotion && window.matchMedia("(any-pointer: fine)").matches) {
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
          let copied = false;
          try { copied = document.execCommand("copy"); } finally { document.body.removeChild(ta); }
          if (!copied) throw new Error("Copy was not accepted");
        }
        const original = btn.textContent;
        const lang = document.documentElement.lang.indexOf("zh") === 0 ? "zh" : "en";
        btn.textContent = lang === "zh" ? "已复制" : "copied";
        btn.classList.add("is-ok");
        const status = document.querySelector(".copy-status");
        if (status) status.textContent = translations["copy.ok"][lang];
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("is-ok");
        }, 1400);
      } catch (err) {
        const lang = document.documentElement.lang.indexOf("zh") === 0 ? "zh" : "en";
        const status = document.querySelector(".copy-status");
        if (status) status.textContent = translations["copy.fail"][lang];
        btn.textContent = lang === "zh" ? "复制失败" : "Copy failed";
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
      if (a.classList.contains("skip-link")) target.focus({ preventScroll: true });
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
  function track(name, data) {
    if (window.umami && typeof window.umami.track === "function") {
      if (data) window.umami.track(name, data);
      else window.umami.track(name);
    }
  }

  // copy buttons — split by what was copied
  document.querySelectorAll(".copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy") || "";
      // the one-line installer is the primary install path; it used to land in copy-other
      if (text.includes("install.sh")) {
        track("copy-oneline");
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

  // outbound GitHub links — same event name as before, with where it leads
  // (sintbot repo / cc-bot repo / a platform setup guide) as event data
  document.querySelectorAll('a[href*="github.com/"]').forEach((a) => {
    const p = new URL(a.href).pathname;
    const parts = p.split("/").filter(Boolean);
    const repo = parts.slice(0, 2).join("/");
    const target = repo === "sintlab/sintbot"
      ? (p.includes("/docs/") ? "sintbot-docs" : "sintbot")
      : repo === "WaterTian/cc-bot"
        ? "cc-bot"
        : parts[0] || "github";
    a.addEventListener("click", () => track("github-click", { target }));
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
