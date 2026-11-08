// sintbot.com — vanilla JS for reveal-on-scroll, copy buttons,
// per-element reveal delays and EN/zh-CN i18n.
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 0) i18n ----------------------------------------------------------------
  // Code blocks, command names and identifiers stay English in both modes.

  // sintbot version — single source of truth for the version shown in the setup
  // section and the JSON-LD softwareVersion. Mirror of the latest npm release;
  // keep this aligned with the versioned installation guide.
  // Bump this one line only, then run scripts/build-zh.mjs.
  const VERSION = "1.3.0";

  const translations = {
  "flow.ui.task": {"en": "Project group · example", "zh": "项目群 · 示例"},
  "flow.ui.ask": {"en": "Update the homepage. Keep the current look.", "zh": "调整首页，沿用现在的视觉风格。"},
  "flow.ui.context": {"en": "Reference attached", "zh": "已附参考图"},
  "flow.ui.received": {"en": "Working in this project", "zh": "正在项目中处理"},
  "flow.ui.routes": {"en": "Agent → model", "zh": "执行器 → 模型"},
  "flow.ui.result": {"en": "Back in the group · example", "zh": "回到群里 · 示例"},
  "flow.ui.changed": {"en": "Homepage updated", "zh": "首页已更新"},
  "flow.ui.checked": {"en": "Mobile layout checked", "zh": "手机布局已核对"},
  "flow.ui.saved": {"en": "Project notes updated", "zh": "项目记录已更新"},
  "meta.title": {
    "en": "SintBot — one project group, your choice of model",
    "zh": "SintBot —— 一群一项目，模型随时换"
  },
  "meta.description": {
    "en": "Connect your project group to Claude Code or Codex. Use Claude, GPT, or GLM, MiniMax and DeepSeek through Claude Code; keep project files and shared notes on your own machine.",
    "zh": "把项目群接入 Claude Code 或 Codex，可选 Claude、GPT，也可通过 Claude Code 接入 GLM、MiniMax、DeepSeek 等模型。项目文件与共享记忆保留在自己的机器上。"
  },
  "meta.ogAlt": {
    "en": "SintBot — one project group, switch models, keep project memory",
    "zh": "SintBot —— 一群一项目，模型随时换，项目记忆延续"
  },
  "nav.platforms": {
    "en": "How it works",
    "zh": "工作方式"
  },
  "nav.models": {
    "en": "Models",
    "zh": "模型"
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
    "en": "One project group. Your choice of model.",
    "zh": "一群一项目，模型由你选择"
  },
  "hero.titleEn": {
    "en": "Your coding agents.<br>Right in the group.",
    "zh": "把编码助手，<br>接进项目群。"
  },
  "hero.lede": {
    "en": "Put Claude Code or Codex to work from your project group. Choose Claude, GPT, GLM, MiniMax or DeepSeek. Keep your files and project memory on your own machine.",
    "zh": "在项目群里，让 Claude Code 或 Codex 开工。Claude、GPT、GLM、MiniMax、DeepSeek，按任务选择。项目文件与写下的记忆，留在自己的机器上。"
  },
  "hero.cta.primary": {
    "en": "Explore the workflow",
    "zh": "看看它怎么工作"
  },
  "plat.trio": {
    "en": "macOS · Feishu · Codex",
    "zh": "macOS · 飞书 · Codex"
  },
  "what.kicker": {
    "en": "FROM THE GROUP TO THE PROJECT",
    "zh": "从群聊，到项目"
  },
  "what.h": {
    "en": "A conversation.<br><em>Actual work.</em>",
    "zh": "群里一句话，<br><em>项目往前走。</em>"
  },
  "what.lede": {
    "en": "SintBot runs on your machine and joins the groups your team already uses. Each group is bound to one project: give it work, follow progress and review the result together.",
    "zh": "SintBot 跑在你自己的机器上，进的是团队本来就在用的群。一群绑定一个项目，在群里派活、看进度，一起评审结果。"
  },
  "plugin.kicker": {
    "en": "GET STARTED",
    "zh": "开始使用"
  },
  "plugin.h": {
    "en": "Your next project,<br><em>connected.</em>",
    "zh": "把下一个项目，<br><em>接进群里。</em>"
  },
  "plugin.lede": {
    "en": "This download is the 1.3.0 built-in-core release: macOS, one Feishu group and Codex, running in the foreground. It does not yet include the existing Claude Code and third-party model routes. Prepare Node.js 22 or later and a working, signed-in <code>codex</code>.",
    "zh": "这里下载的是 1.3.0 内置核心发行版：macOS、一个飞书群、Codex，前台运行；尚未包含已有的 Claude Code 与第三方模型路径。需要 Node.js 22 及以上，以及可正常使用且已登录的 <code>codex</code>。"
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
    "en": "A FEW GOOD QUESTIONS",
    "zh": "你可能想知道"
  },
  "faq.h": {
    "en": "Before you <em>get started.</em>",
    "zh": "开始之前，<em>把这些说清楚。</em>"
  },
  "faq.1.q": {
    "en": "What is SintBot?",
    "zh": "SintBot 是什么？"
  },
  "faq.1.a": {
    "en": "A coding assistant that connects a project group to Claude Code or Codex on your own machine. You can choose the coding agent and its model service, while keeping the project files and saved notes. The current download has a narrower scope, described below.",
    "zh": "把项目群连接到自己机器上的 Claude Code 或 Codex 的编码助手。你可以选择编码执行器及其模型服务，保留项目文件和已保存的笔记。当前下载版本的范围较窄，具体见下方版本说明。"
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
    "en": "No. SintBot and the project run on your machine, but the chat platform and configured model services require a network connection. Model requests follow the selected agent’s configuration and the service provider’s data policy.",
    "zh": "不是。SintBot 和项目在本机运行，聊天平台及配置的模型服务仍需联网。模型请求遵循所选执行器的配置及服务商的数据政策。"
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
    "en": "Bring the project to the conversation.",
    "zh": "让项目，回到团队的对话里。"
  },
  "cta.p": {
    "en": "Choose your coding agent. Keep your project close.",
    "zh": "选好编码助手，带着项目一起往前走。"
  },
  "foot.tag": {
    "en": "Project groups · Claude Code & Codex · Switchable models",
    "zh": "项目群驱动 · Claude Code 与 Codex · 模型可切换"
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
    "en": "Not affiliated with Feishu, Anthropic, OpenAI or any other provider named here. Product names and logos belong to their respective owners.",
    "zh": "与飞书、Anthropic、OpenAI 或其他提及的服务商无隶属关系，产品名称及标志归其各自所有者。"
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
  },
  "models.kicker": {
    "en": "YOUR AGENTS. YOUR MODELS.",
    "zh": "执行器可选，模型也可选"
  },
  "models.h": {
    "en": "A model for <em>your way of working.</em>",
    "zh": "按你的工作方式，<em>选择模型。</em>"
  },
  "models.lede": {
    "en": "Claude Code and Codex are the coding agents. Claude, GPT, GLM, MiniMax and DeepSeek are the models behind them. Choose the combination that fits your project.",
    "zh": "Claude Code、Codex 是编码执行器；Claude、GPT、GLM、MiniMax、DeepSeek 是背后的模型。为项目选择合适的组合。"
  },
  "models.p.claude": {
    "en": "through Claude Code",
    "zh": "通过 Claude Code"
  },
  "models.p.gpt": {
    "en": "through Codex",
    "zh": "通过 Codex"
  },
  "models.p.glm": {
    "en": "Claude Code · your API key",
    "zh": "Claude Code · 自备 API Key"
  },
  "models.p.deepseek": {
    "en": "Claude Code · your API key",
    "zh": "Claude Code · 自备 API Key"
  },
  "models.p.minimax": {
    "en": "Claude Code · your API key",
    "zh": "Claude Code · 自备 API Key"
  },
  "models.p.kimi": {
    "en": "Claude Code · custom endpoint",
    "zh": "Claude Code · 自定义端点"
  },
  "models.note": {
    "en": "These routes are part of SintBot’s existing multi-model workflow. The 1.3.0 built-in-core download currently covers the Codex route only; keep your existing installation for Claude Code and third-party models until compatible migration is available.",
    "zh": "这些路径属于 SintBot 已有的多模型工作方式。当前 1.3.0 内置核心下载包仅覆盖 Codex 路径；使用 Claude Code 与第三方模型的现有安装，请继续保留，等待兼容迁移。"
  },
  "models.1.title": {
    "en": "Switch in the group",
    "zh": "群里就能切"
  },
  "models.1.body": {
    "en": "In an existing multi-model installation, choose a configured model in the group for the next turn. Switching starts a fresh conversation; project files and saved memory remain.",
    "zh": "已有多模型版本可在群里选择已配置的模型，让下一轮用它开工。切换会开启新对话，项目文件和已保存的记忆保留。"
  },
  "models.2.title": {
    "en": "Configure each group for its work",
    "zh": "按群配置，按任务选模型"
  },
  "models.2.body": {
    "en": "Each group has its own coding agent and model. Claude Code connects to Claude or compatible services such as GLM, MiniMax and DeepSeek; Codex uses its own account and model configuration.",
    "zh": "每个群有自己的执行器和模型。Claude Code 可连接 Claude、GLM、MiniMax、DeepSeek 等兼容服务；Codex 使用自己的账号和模型配置。"
  },
  "models.3.title": {
    "en": "Memory outlives the model",
    "zh": "记忆比模型活得久"
  },
  "models.3.body": {
    "en": "Keep project conventions, decisions and unfinished work in local shared files such as <code>CLAUDE.md</code> and <code>AGENTS.md</code>. After switching models, a fresh conversation can read those notes and continue.",
    "zh": "把项目约定、决定和未完成事项写进 <code>CLAUDE.md</code>、<code>AGENTS.md</code> 等共享文件，留在本地。换模型后，新对话可以读取这些记录继续工作。"
  },
  "faq.7.q": {
    "en": "Which models can SintBot use?",
    "zh": "SintBot 可以使用哪些模型？"
  },
  "faq.7.a": {
    "en": "Existing multi-model installations use Claude through Claude Code, GPT through Codex, and GLM, MiniMax or DeepSeek through Claude Code with compatible endpoints and your own API keys. Kimi and other compatible providers can use custom endpoints. The 1.3.0 download currently includes only the Codex route.",
    "zh": "已有的多模型版本可通过 Claude Code 使用 Claude，通过 Codex 使用 GPT，也可在 Claude Code 中配置兼容端点和自己的 API Key，接入 GLM、MiniMax、DeepSeek。Kimi 等兼容服务可使用自定义端点。当前 1.3.0 下载包仅包含 Codex 路径。"
  },
  "faq.8.q": {
    "en": "What stays when I switch models?",
    "zh": "换模型之后，什么会保留？"
  },
  "faq.8.a": {
    "en": "The project files and saved shared notes remain. Switching starts a fresh conversation; record decisions and unfinished work in the project so the next agent can read them. It does not automatically transfer every unsaved detail from the previous conversation.",
    "zh": "项目文件和已保存的共享笔记保留。切换会开启新对话；把决定和未完成事项写进项目，下一位助手即可读取接续，不会自动完整转移上一段对话中尚未保存的细节。"
  },
  "hero.cta.install": {
    "en": "Get SintBot",
    "zh": "安装 SintBot"
  },
  "demo.tab.task": {
    "en": "Give it a task",
    "zh": "群里派活"
  },
  "demo.tab.models": {
    "en": "Switch models",
    "zh": "切换模型"
  },
  "demo.tab.memory": {
    "en": "Keep project memory",
    "zh": "项目记忆"
  },
  "demo.tab.local": {
    "en": "Work locally",
    "zh": "本机执行"
  },
  "demo.example": {
    "en": "Workflow example",
    "zh": "工作流程示例"
  },
  "demo.project": {
    "en": "Website project",
    "zh": "官网项目"
  },
  "demo.sidebar.title": {
    "en": "YOUR WORKSPACE",
    "zh": "你的工作区"
  },
  "demo.sidebar.task": {
    "en": "Project conversation",
    "zh": "项目对话"
  },
  "demo.sidebar.models": {
    "en": "Agents & models",
    "zh": "执行器与模型"
  },
  "demo.sidebar.memory": {
    "en": "Project notes",
    "zh": "项目笔记"
  },
  "demo.sidebar.files": {
    "en": "Local files",
    "zh": "本机文件"
  },
  "demo.sidebar.bottom": {
    "en": "Your machine. Your project.",
    "zh": "自己的机器，自己的项目。"
  },
  "demo.you": {
    "en": "You",
    "zh": "你"
  },
  "demo.task.ask": {
    "en": "Keep the original typography. Improve the mobile navigation and show me the changes.",
    "zh": "沿用原来的字体排版，把手机导航优化一下，做好给我看。"
  },
  "demo.task.status": {
    "en": "Working in the website project",
    "zh": "正在官网项目里处理"
  },
  "demo.task.reply": {
    "en": "The mobile navigation now fits small screens. The page typography stays the same.",
    "zh": "手机导航已适配小屏，页面字体和排版保持原样。"
  },
  "demo.task.file": {
    "en": "Navigation updated",
    "zh": "导航已更新"
  },
  "demo.task.check": {
    "en": "Mobile layout reviewed",
    "zh": "手机布局已检查"
  },
  "demo.task.footer": {
    "en": "The task, progress and result stay in one conversation.",
    "zh": "任务、进展与结果，都留在同一段对话里。"
  },
  "demo.models.h": {
    "en": "Same project. A different model.",
    "zh": "同一个项目，换一种模型。"
  },
  "demo.models.p": {
    "en": "Choose the coding agent, then its model. Claude Code also connects to compatible third-party services.",
    "zh": "先选编码执行器，再选模型。Claude Code 也可以连接兼容的第三方模型服务。"
  },
  "demo.models.route": {
    "en": "Claude Code route",
    "zh": "通过 Claude Code"
  },
  "demo.models.codex": {
    "en": "Codex route",
    "zh": "通过 Codex"
  },
  "demo.models.note": {
    "en": "Switching starts a new conversation. Saved project notes carry over.",
    "zh": "切换会开启新对话，已保存的项目笔记继续保留。"
  },
  "demo.memory.h": {
    "en": "Leave the next agent a clear handoff.",
    "zh": "换个助手，也能接着做。"
  },
  "demo.memory.p": {
    "en": "Decisions live with the project, ready for whichever model you choose next.",
    "zh": "把决定写进项目，下一次选谁，都有据可循。"
  },
  "demo.memory.line1": {
    "en": "# Website project",
    "zh": "＃ 官网项目"
  },
  "demo.memory.line2": {
    "en": "Keep the existing type and spacing.",
    "zh": "沿用现有字体与间距。"
  },
  "demo.memory.line3": {
    "en": "Mobile navigation: updated and reviewed.",
    "zh": "手机导航：已更新并检查。"
  },
  "demo.memory.line4": {
    "en": "Next: review the installation section.",
    "zh": "下一步：检查安装说明。"
  },
  "demo.memory.note": {
    "en": "Project notes persist. Unsaved chat details are not a shared memory.",
    "zh": "项目笔记会保留，未保存的聊天细节不会自动共享。"
  },
  "demo.local.h": {
    "en": "The work happens in your project.",
    "zh": "任务在你的项目里完成。"
  },
  "demo.local.p": {
    "en": "Code, assets and saved notes stay on your machine. The selected model service handles model requests.",
    "zh": "代码、素材与已保存笔记留在本机，模型请求由所选模型服务处理。"
  },
  "demo.local.files": {
    "en": "Project files",
    "zh": "项目文件"
  },
  "demo.local.result": {
    "en": "A change you can review",
    "zh": "可以检查的改动"
  },
  "demo.local.status": {
    "en": "Changes remain in your workspace",
    "zh": "改动保留在你的工作区"
  },
  "demo.scope": {
    "en": "Examples show SintBot’s product workflow. The current download’s supported scope is listed below.",
    "zh": "示例展示 SintBot 的产品工作方式，当前下载版本的支持范围见安装说明。"
  },
  "flow.1.h": {
    "en": "One group, one project",
    "zh": "一群一项目，群里直接派活"
  },
  "flow.1.p": {
    "en": "Bind a chat group to a project. Anyone on the team can describe a task, add context and ask the agent to read or change code, work on design or prepare a report.",
    "zh": "一个聊天群绑定一个项目，团队成员在群里说需求、补充上下文，让助手读代码、改代码、做设计、出报告。"
  },
  "flow.2.h": {
    "en": "Work on your own machine",
    "zh": "在自己的机器上执行"
  },
  "flow.2.p": {
    "en": "Each turn goes to Claude Code or Codex, working in the bound project directory with the model, tools and permissions you configure.",
    "zh": "每一轮交给 Claude Code 或 Codex，在绑定的项目目录里工作，使用你配置的模型、工具与权限。"
  },
  "flow.3.h": {
    "en": "Progress and results return to the group",
    "zh": "进度和结果，回到群里"
  },
  "flow.3.p": {
    "en": "Follow progress in the group, then review the reply, images or files together. Continue the discussion and ask for changes where the work began.",
    "zh": "执行时在群里更新进度，完成后交付回复、图片或文件；团队围绕结果继续讨论和修改。"
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
  const revealEls = Array.from(document.querySelectorAll(".hero [data-reveal]"));
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

  // Installation and workflow calls to action.
  document.querySelectorAll('.btn[href="#plugin"]').forEach((btn) => {
    btn.addEventListener("click", () => track("cta-install"));
  });
  document.querySelectorAll('.btn[href="#what"]').forEach((btn) => {
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
    document.querySelectorAll("main .section[id]").forEach((s) => secObs.observe(s));
  }

})();
