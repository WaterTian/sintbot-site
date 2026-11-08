const VERSION = "1.3.0";
const translations = {
  "meta.title": {
    "en": "SintBot 1.3.0 — a coding agent in one Feishu group",
    "zh": "SintBot 1.3.0 —— 飞书单群里的编码助手"
  },
  "meta.description": {
    "en": "SintBot 1.3.0 starts with a built-in core path for Codex messages in one Feishu group on macOS. Other platforms and group workflows will follow.",
    "zh": "SintBot 1.3.0 首版提供 macOS 飞书单群 Codex 消息的内置核心路径；其他平台与多群能力后续迭代。"
  },
  "meta.ogAlt": {
    "en": "SintBot 1.3.0 first release: macOS, one Feishu group, Codex messages",
    "zh": "SintBot 1.3.0 首版：macOS、飞书单群、Codex 消息"
  },
  "nav.scope": {
    "en": "Scope",
    "zh": "支持范围"
  },
  "nav.faq": {
    "en": "FAQ",
    "zh": "常见问题"
  },
  "nav.docs": {
    "en": "Project docs",
    "zh": "项目文档"
  },
  "hero.eyebrow": {
    "en": "SintBot 1.3.0 · first release scope",
    "zh": "SintBot 1.3.0 · 首版范围"
  },
  "hero.title": {
    "en": "A coding agent in one Feishu group.",
    "zh": "飞书单群里的编码助手。"
  },
  "hero.lede": {
    "en": "On your Mac, SintBot connects one Feishu group to one project. A message starts a Codex turn through the built-in core; the final answer returns to the group.",
    "zh": "在 Mac 上，SintBot 将一个飞书群连接到一个项目。群消息经内置核心启动 Codex 轮次，最终答复回到群里。"
  },
  "hero.pill": {
    "en": "macOS · one Feishu group · Codex message path",
    "zh": "macOS · 一个飞书群 · Codex 消息路径"
  },
  "scope.eyebrow": {
    "en": "What 1.3.0 covers",
    "zh": "1.3.0 支持范围"
  },
  "scope.title": {
    "en": "Start with a working core path.",
    "zh": "先交付可用的核心路径。"
  },
  "scope.mac.title": {
    "en": "Runs on macOS",
    "zh": "支持 macOS"
  },
  "scope.mac.body": {
    "en": "The first version is validated on Mac. Linux and Windows support will follow.",
    "zh": "首版在 Mac 上验收；Linux 和 Windows 后续适配。"
  },
  "scope.group.title": {
    "en": "One Feishu group",
    "zh": "一个飞书群"
  },
  "scope.group.body": {
    "en": "One group is bound to one local project. The first release does not support multiple groups in one service.",
    "zh": "一个群绑定一个本机项目；首版内置核心暂不支持一个服务接多个群。"
  },
  "scope.turn.title": {
    "en": "Codex message turn",
    "zh": "Codex 消息轮次"
  },
  "scope.turn.body": {
    "en": "Send a task in the group; Codex works in the bound project and returns its answer. Start read-only, and keep the foreground terminal open.",
    "zh": "在群里发任务，Codex 在绑定项目中工作并回复。建议先用只读权限，运行时保持前台终端开启。"
  },
  "later.eyebrow": {
    "en": "Later updates",
    "zh": "后续迭代"
  },
  "later.title": {
    "en": "More paths are coming.",
    "zh": "逐步扩展更多能力。"
  },
  "later.body": {
    "en": "Feishu whiteboards, multiple groups, Slack, WeCom, the management console, schedules and terminal chat are outside the first built-in-core support scope. Existing installations using these features should stay on their current version until a compatible upgrade path is published.",
    "zh": "飞书画板、多群、Slack、企业微信、管理控制台、定时任务和终端聊天不在首版内置核心支持范围。正在使用这些能力的安装应保持当前版本，等待兼容的升级路径。"
  },
  "faq.eyebrow": {
    "en": "Frequently asked",
    "zh": "常见问题"
  },
  "faq.title": {
    "en": "A clear first step.",
    "zh": "先把首版范围说清楚。"
  },
  "faq.1.q": {
    "en": "What is SintBot?",
    "zh": "SintBot 是什么？"
  },
  "faq.1.a": {
    "en": "A self-hosted coding assistant for a project group. The first 1.3.0 core path runs a Codex message turn in one Feishu group on macOS.",
    "zh": "运行在自己机器上的项目群编码助手。1.3.0 首版内置核心路径支持 macOS 飞书单群中的 Codex 消息轮次。"
  },
  "faq.2.q": {
    "en": "Can I upgrade my multi-group installation?",
    "zh": "现有多群安装能直接升级吗？"
  },
  "faq.2.a": {
    "en": "Not to this restricted path. Keep your current service until a compatible multi-group upgrade and recovery procedure is published.",
    "zh": "暂不能直接切到这个受限路径。请保持当前服务，等待兼容的多群升级与恢复方案。"
  },
  "faq.3.q": {
    "en": "Are whiteboards and other chat platforms included?",
    "zh": "画板和其他聊天平台包含在首版吗？"
  },
  "faq.3.a": {
    "en": "No. Whiteboards, Slack and WeCom are planned for later releases of the built-in-core path.",
    "zh": "不包含。画板、Slack 和企业微信将在后续内置核心版本中完善。"
  },
  "faq.4.q": {
    "en": "Where can I find installation instructions?",
    "zh": "哪里看安装说明？"
  },
  "faq.4.a": {
    "en": "Use the version 1.3.0 installation guide on this page. The installer adds a separate package directory; then configure one group, initialize fresh state and start in the foreground.",
    "zh": "按本页 1.3.0 安装指南操作：安装器把程序放到独立目录，再配置一个群、初始化全新状态并在前台启动。"
  },
  "cta.package": {
    "en": "View package",
    "zh": "查看安装包"
  },
  "cta.project": {
    "en": "Project repository",
    "zh": "项目仓库"
  },
  "foot.copy": {
    "en": "SintBot by WaterTian · Published by SintLab",
    "zh": "SintBot 作者 WaterTian · SintLab 发布"
  },
  "foot.terms": {
    "en": "Terms",
    "zh": "服务条款"
  },
  "foot.privacy": {
    "en": "Privacy",
    "zh": "隐私政策"
  },
  "install.title": {
    "en": "Install 1.3.0 on your Mac.",
    "zh": "在 Mac 上安装 1.3.0。"
  },
  "install.body": {
    "en": "Requires Node.js 22+ and a working, authenticated local Codex. The installer preserves existing global installations and services. Do not migrate a multi-group installation with this single-group release.",
    "zh": "需要 Node.js 22 及以上，以及已安装并登录的本机 Codex。安装器保留已有全局安装和服务；不要用这个单群版本直接迁移多群安装。"
  },
  "install.guide": {
    "en": "Read the 1.3.0 installation guide",
    "zh": "阅读 1.3.0 安装指南"
  },
  "install.source": {
    "en": "Inspect the installer",
    "zh": "查看安装脚本"
  },
  "license.body": {
    "en": "Distributed under PolyForm Shield 1.0.0. The package includes a built-in core. See the package license and third-party notices.",
    "zh": "按 PolyForm Shield 1.0.0 分发。安装包包含内置核心，许可及第三方声明随包提供。"
  }
  };
