# sintbot 平台站重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 sintbot.com 从「cc-bot for Slack」单产品站重设计为「sintbot 平台站」—— 两个平级支柱（多模型群聊机器人 + 桌宠），单页、零构建、克制 editorial 调性全部保留。

**Architecture:** 方案 A —— 在现有 `index.html` 内容外套一层平台框架。改动集中在三个文件：`index.html`（结构 + meta）、`styles.css`（新区块样式）、`app.js`（i18n）。现有 6 段 cc-bot 深度内容正文 / 内联 SVG / i18n 正文 key 全部不动，仅改 kicker 编号。新增区块沿用现有 `.card` / `.section` / chip 组件与 `--ink/--signal/--acid` 等 CSS 变量。

**Tech Stack:** 原生 HTML / CSS / JS，零构建、零依赖。验证用 `python -m http.server` + chrome-devtools MCP（本项目无测试框架；"测试"= 浏览器渲染检查 + console 无报错 + 双语切换检查，符合 `CLAUDE.md` 的 Windows Chrome 实测约定）。

**设计依据:** `docs/superpowers/specs/2026-05-19-sintbot-platform-redesign-design.md`

---

## 文件结构

| 文件 | 本计划中的职责 |
|---|---|
| `index.html` | 平台 meta、导航改造、新增 3 个平台区块的结构标记、CTA/页脚改造 |
| `styles.css` | 新增 支柱卡 / agent 槽位 / 桌宠区 / 状态板 / hero idle 动效 样式；尾部追加，不改现有规则 |
| `app.js` | `translations` 对象新增/改动 i18n 条目；不改任何逻辑 |

不新增文件（桌宠表情图属待定项路线 2）。不引入构建工具、依赖、测试框架。

## 通用约定

- **每个 Task 在功能分支上独立提交。** 半成品不得进 `main`（`main` = 自动部署）。
- 每个 Task 的验证统一流程（下称「**浏览器验证流程**」）：
  1. `python -m http.server 8765`（后台，若未运行）
  2. chrome-devtools MCP `navigate_page` 到 `http://localhost:8765/`，`ignoreCache: true`
  3. `list_console_messages` 过滤 `error` / `warn` —— 除 `goatcounter: not counting because of: localhost` 外应为空
  4. `take_screenshot` 目检
  5. `evaluate_script` 点击语言切换按钮，确认中/英两版都正确
- i18n 规则（见 `CLAUDE.md`）：所有文案用 `data-i18n` / `data-i18n-html` 标记，字符串进 `app.js` 的 `translations`，EN + 中文各一份。代码 / 命令 / 标识符两种语言都保持英文。

---

## Task 0: 创建功能分支

**Files:** 无（git 操作）

- [ ] **Step 1: 从最新 main 切出分支**

```bash
git checkout main
git pull origin main
git checkout -b redesign/sintbot-platform
```

- [ ] **Step 2: 确认分支与干净工作区**

Run: `git status`
Expected: `On branch redesign/sintbot-platform` / `nothing to commit, working tree clean`

---

## Task 1: 页面 meta + 导航平台化

**Files:**
- Modify: `index.html`（`<head>` meta；`<header class="nav">` 整块；`<footer>` 内导航链接）
- Modify: `app.js`（`translations` —— nav key）

- [ ] **Step 1: 改 `<head>` meta 为平台级**

`index.html` 中：

```html
<title>sintbot — AI agents in your group chat, with a face</title>
<meta
  name="description"
  content="sintbot is a local-first platform: cc-bot puts an AI agent (Claude Code) in your Slack or Lark group, and a desktop pet gives it a face — watching the project, working beside you."
/>
```

`<link rel="canonical">`、`<meta name="theme-color">`、字体 `<link>`、GoatCounter `<script>`、`CNAME` 不动。

- [ ] **Step 2: 改导航品牌 `sint`〔走线〕`bot`**

把 `<a class="nav__brand">` 内的字标从 `cc<i class="nav__trace">bot` 改为 `sint<i class="nav__trace">bot`，删除 `<span class="nav__forslack">for Slack</span>`：

```html
<a class="nav__brand" href="#top" aria-label="sintbot home">
  <img src="./assets/logo.png" alt="" width="36" height="36" />
  <span class="nav__word">sint<i class="nav__trace" aria-hidden="true"></i>bot</span>
</a>
```

- [ ] **Step 3: 改导航菜单为支柱级锚点**

`<nav class="nav__menu">` 内的三个内部锚点改为：

```html
<a href="#bot" data-i18n="nav.bot">Bot</a>
<a href="#pet" data-i18n="nav.pet">Desktop pet</a>
<a href="#install" data-i18n="nav.setup">Setup</a>
```

删除原 `#scenarios` / `#capabilities` / `#architecture` 三个锚点链接。`GitHub` 外链 CTA 与 `.lang-toggle` 不动。

- [ ] **Step 4: 同步页脚导航**

`<footer>` 内 `<nav class="foot__nav">` 的内部锚点同样改为 `#bot` / `#pet` / `#install`（`data-i18n` 同上），保留 GitHub 链接。

- [ ] **Step 5: app.js —— 新增/调整 nav i18n**

`translations` 中删除 `nav.scenarios` / `nav.capabilities` / `nav.architecture`（若无其他引用），新增：

```js
"nav.bot":  { en: "Bot",          zh: "机器人" },
"nav.pet":  { en: "Desktop pet",  zh: "桌宠" },
```

`nav.setup`（`{ en: "Setup", zh: "接入" }`）保留不动。

- [ ] **Step 6: styles.css —— 确认走线动效仍生效**

`.nav__trace` 是基于相邻字符定位的动效，字标从 4 字（`ccbot`）变 7 字（`sintbot`）后目检走线位置；如偏移，在 `styles.css` 末尾微调 `.nav__word` / `.nav__trace` 的间距即可，不改动效逻辑。

- [ ] **Step 7: 验证**

执行「浏览器验证流程」。重点：导航显示 `sintbot`、菜单为 机器人/桌宠/接入、走线动效正常、无 console 报错、中英切换正确。

- [ ] **Step 8: Commit**

```bash
git add index.html app.js styles.css
git commit -m "feat: platform-level meta and nav (sintbot brand)"
```

---

## Task 2: Hero 平台化

**Files:**
- Modify: `index.html`（`<section class="hero">` 内 H1 第三行、lede、CTA、桌宠形象节点）
- Modify: `styles.css`（末尾追加：hero 桌宠形象定位 + idle 动效）
- Modify: `app.js`（`translations` —— `hero.titleEn` / `hero.lede` / `hero.cta.primary`）

- [ ] **Step 1: H1 第三行 `整个项目` → `桌宠`**

`index.html` 中 `<h1 class="hero__title">` 内第三个 `<span>`：

```html
<span data-reveal data-reveal-delay="240">Desktop pet</span>
```

- [ ] **Step 2: app.js —— 改 `hero.titleEn` 第三行**

`translations["hero.titleEn"]`：en 第三行 `<span>` 文本改为 `Desktop pet`，zh 第三行改为 `桌宠`（保留 `data-reveal` / `data-reveal-delay="240"` 属性，保留前两行不动）：

```js
"hero.titleEn": {
  en: `<span data-reveal data-reveal-delay="0">Group chat</span>
       <em data-reveal data-reveal-delay="120">「Local Agent」</em>
       <span data-reveal data-reveal-delay="240">Desktop pet</span>`,
  zh: `<span data-reveal data-reveal-delay="0">群里聊天</span>
       <em data-reveal data-reveal-delay="120">「Local Agent」</em>
       <span data-reveal data-reveal-delay="240">桌宠</span>`
},
```

- [ ] **Step 3: app.js —— 改 `hero.lede` 为平台级**

```js
"hero.lede": {
  en: "sintbot is a platform: <code>cc-bot</code> puts an AI agent in your Slack or Lark group — Claude Code runs on your laptop — and a desktop pet gives it a face that watches the project and works beside you.",
  zh: "sintbot 是一个平台：<code>cc-bot</code> 把一个 AI agent 接进你的飞书/Slack 群 —— Claude Code 跑在你本机 —— 再用一只桌宠给它一张脸，盯着项目、陪你工作。"
},
```

- [ ] **Step 4: app.js —— 改 `hero.cta.primary` 指向平台引入区**

```js
"hero.cta.primary": { en: "Meet sintbot", zh: "认识 sintbot" },
```

`index.html` 中该 CTA 的 `<a class="btn btn--primary">` 的 `href` 从 `#install` 改为 `#what`。

- [ ] **Step 5: index.html —— 在大标题旁加桌宠形象节点**

`<h1 class="hero__title">` 之后、`<p class="hero__lede">` 之前，插入：

```html
<img
  class="hero__pet"
  src="./assets/logo.png"
  alt=""
  aria-hidden="true"
  width="120"
  height="120"
/>
```

- [ ] **Step 6: styles.css —— 桌宠定位 + idle 动效**

在 `styles.css` 末尾追加（`prefers-reduced-motion` 下停动效，符合现有约定）：

```css
/* ---- hero desktop-pet mascot ------------------------------------ */
.hero__pet {
  position: absolute;
  top: clamp(80px, 12vw, 160px);
  right: clamp(20px, 6vw, 90px);
  width: clamp(72px, 9vw, 120px);
  height: auto;
  pointer-events: none;
  z-index: 2;
  animation: pet-idle 4.5s var(--ease-in-out) infinite;
  transform-origin: 50% 100%;
}
@keyframes pet-idle {
  0%, 100% { transform: translateY(0) rotate(-1.5deg); }
  50%      { transform: translateY(-7px) rotate(1.5deg); }
}
@media (prefers-reduced-motion: reduce) {
  .hero__pet { animation: none; }
}
```

`.hero` 已是定位上下文则直接生效；若 `.hero` 无 `position`，在末尾追加 `.hero { position: relative; }`（先查现有规则，避免重复）。移动端如与标题重叠，用媒体查询缩小 `.hero__pet` 或下移，目检定夺。

- [ ] **Step 7: 验证**

执行「浏览器验证流程」。重点：H1 第三行为 `桌宠`/`Desktop pet`；桌宠形象在标题区可见、有呼吸浮动；lede 为平台文案；主 CTA 文案为 `认识 sintbot`、点击平滑滚到 `#what`（`#what` 区块在 Task 3 加，此前点击不滚动属正常）；中英切换正确。

- [ ] **Step 8: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: platform-level hero with desktop-pet mascot"
```

---

## Task 3: 「sintbot 是什么」平台引入区

**Files:**
- Modify: `index.html`（在 `</section>`(hero) 之后、`#scenarios` 之前插入新 `<section id="what">`）
- Modify: `styles.css`（末尾追加：`.pillars` 样式）
- Modify: `app.js`（`translations` —— what 区 key）

- [ ] **Step 1: index.html —— 插入平台引入区结构**

在 hero `</section>` 之后插入：

```html
<!-- What is sintbot -->
<section id="what" class="section section--what">
  <div class="rule" aria-hidden="true"></div>
  <p class="section__kicker" data-reveal data-i18n="what.kicker">Platform</p>
  <h2 class="section__h" data-reveal data-i18n-html="what.h">What <em>sintbot</em> is.</h2>
  <p class="lede lede--wide" data-reveal data-i18n="what.lede">
    Local-first, MIT, no runtime. sintbot lives in the group chat your team already uses.
  </p>
  <ol class="pillars">
    <li class="pillar" data-reveal>
      <span class="pillar__no">①</span>
      <h3 data-i18n="what.bot.title">Multi-model group bot</h3>
      <p data-i18n-html="what.bot.body">
        Drop an AI agent into a Slack / Lark channel — mention it, it works.
        <code>cc-bot</code> is the Claude Code edition, live today.
      </p>
      <a class="pillar__link" href="#bot" data-i18n="what.bot.link">See the bot →</a>
    </li>
    <li class="pillar" data-reveal data-reveal-delay="80">
      <span class="pillar__no">②</span>
      <h3 data-i18n="what.pet.title">Desktop pet</h3>
      <p data-i18n="what.pet.body">
        A creature on every teammate's desktop — it listens to the channel,
        cares about the project, and works beside you with a personality.
      </p>
      <a class="pillar__link" href="#pet" data-i18n="what.pet.link">See the pet →</a>
    </li>
  </ol>
</section>
```

- [ ] **Step 2: app.js —— 新增 what 区 i18n**

```js
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
```

- [ ] **Step 3: styles.css —— `.pillars` 样式**

末尾追加。复用现有 `.card` 视觉语言（边框 `--line`、序号、hover 抬升）：

```css
/* ---- what-is-sintbot : two pillars ------------------------------ */
.pillars {
  list-style: none;
  margin: clamp(28px, 5vw, 56px) 0 0;
  padding: 0;
  display: grid;
  gap: clamp(14px, 2vw, 22px);
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 720px) {
  .pillars { grid-template-columns: 1fr; }
}
.pillar {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: clamp(22px, 3vw, 34px);
  background: var(--ink-2);
  transition: transform 0.4s var(--ease-out), border-color 0.4s var(--ease-out);
}
.pillar:hover {
  transform: translateY(-4px);
  border-color: var(--signal);
}
.pillar__no {
  font-family: var(--f-display);
  font-size: 1.6rem;
  color: var(--signal);
}
.pillar h3 {
  font-family: var(--f-display);
  font-size: clamp(1.25rem, 2.4vw, 1.7rem);
  margin: 6px 0 10px;
}
.pillar p { color: var(--bone-2); margin: 0 0 16px; }
.pillar__link {
  font-family: var(--f-mono);
  font-size: 0.85rem;
  color: var(--signal);
  text-decoration: none;
}
.pillar__link:hover { color: var(--gold); }
```

- [ ] **Step 4: 验证**

执行「浏览器验证流程」。重点：hero 之后出现「平台」区，两张支柱卡并列、hover 抬升、序号 ①②；点支柱链接平滑滚动（`#bot` 在 Task 4 加，`#pet` 在 Task 5 加，此前不滚动正常）；hero 主 CTA 现在能滚到本区；中英切换正确。

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: add 'what is sintbot' platform intro with two pillars"
```

---

## Task 4: 支柱 ① 模型层引子 + 现有章节重编号

**Files:**
- Modify: `index.html`（在 `#what` 之后、`#scenarios` 之前插入 `<section id="bot">`）
- Modify: `styles.css`（末尾追加：`.agent-slots` 样式）
- Modify: `app.js`（`translations` —— bot 引子 key；6 段 kicker 重编号）

- [ ] **Step 1: index.html —— 插入模型层引子**

在 `#what` `</section>` 之后插入：

```html
<!-- Pillar ① — multi-model bot intro -->
<section id="bot" class="section section--botintro">
  <div class="rule" aria-hidden="true"></div>
  <p class="section__kicker" data-reveal data-i18n="bot.kicker">Pillar ①</p>
  <h2 class="section__h" data-reveal data-i18n="bot.h">Put an AI agent in the channel.</h2>
  <p class="lede lede--wide" data-reveal data-i18n="bot.lede">
    The bot binds one AI agent into a Slack / Lark group — mention it, and the agent
    reads the intent, does the work and replies, all on your own machine.
  </p>
  <ul class="agent-slots" data-reveal>
    <li class="agent-slot agent-slot--live">
      <span class="agent-slot__dot"></span>
      <b>Claude Code</b>
      <span class="agent-slot__tag" data-i18n="bot.slot.live">cc-bot · live</span>
    </li>
    <li class="agent-slot agent-slot--ghost">
      <span class="agent-slot__dot"></span>
      <b data-i18n="bot.slot.other">Other AI agents</b>
      <span class="agent-slot__tag" data-i18n="bot.slot.planned">planned</span>
    </li>
  </ul>
  <p class="botintro__bridge" data-reveal data-i18n="bot.bridge">
    Below is cc-bot — the full Claude Code edition.
  </p>
</section>
```

> 说明：`id="bot"` 落在本引子区，导航/支柱卡的 `#bot` 锚点即指向支柱 ① 开篇。

- [ ] **Step 2: app.js —— 新增模型层引子 i18n**

```js
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
```

- [ ] **Step 3: app.js —— 现有 6 段 kicker 重编号**

只改 kicker 文案的编号前缀，正文 key 全部不动：

```js
"scenarios.kicker": { en: "①·01 — In your workspace", zh: "①·01 — 在你的工作区里" },
"local.kicker":     { en: "①·02 — On your machine",   zh: "①·02 — 跑在你机器上" },
"cap.kicker":       { en: "①·03 — Capabilities",      zh: "①·03 — 能力" },
"adapter.kicker":   { en: "①·04 — Engineering note",  zh: "①·04 — 工程笔记" },
"arch.kicker":      { en: "①·05 — Architecture",      zh: "①·05 — 架构" },
"install.kicker":   { en: "①·06 — Slack setup",       zh: "①·06 — Slack 接入" },
```

- [ ] **Step 4: styles.css —— `.agent-slots` 样式**

末尾追加：

```css
/* ---- pillar ① : agent slots ------------------------------------ */
.agent-slots {
  list-style: none;
  margin: clamp(22px, 4vw, 40px) 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
.agent-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 18px;
  font-family: var(--f-mono);
  font-size: 0.9rem;
}
.agent-slot__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--acid);
}
.agent-slot--live { border-color: var(--signal); }
.agent-slot--ghost { opacity: 0.45; }
.agent-slot--ghost .agent-slot__dot { background: var(--muted); }
.agent-slot__tag { color: var(--muted); }
.botintro__bridge {
  margin-top: clamp(22px, 4vw, 40px);
  font-family: var(--f-mono);
  font-size: 0.9rem;
  color: var(--muted);
}
```

- [ ] **Step 5: 验证**

执行「浏览器验证流程」。重点：`#what` 之后出现「支柱 ①」引子，两个 agent 槽位（Claude Code 实心高亮 / Other 灰显 45% 透明）；其后紧接现有「①·01 — 在你的工作区里」场景区；6 段 kicker 编号均为 `①·01`–`①·06`；导航「机器人」与支柱①卡链接点击滚到本区；现有场景/能力/架构/安装正文与 SVG 未变；中英切换正确。

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: pillar ① model-layer intro + renumber cc-bot sections"
```

---

## Task 5: 支柱 ② 桌宠区块 — 结构、4 张卡、收尾

**Files:**
- Modify: `index.html`（在 `#install` `</section>` 之后、`.section--cta` 之前插入 `<section id="pet">`）
- Modify: `styles.css`（末尾追加：`.section--pet` / `.pet-cards` 样式）
- Modify: `app.js`（`translations` —— pet 区 key）

- [ ] **Step 1: index.html —— 插入桌宠区块结构（状态板留占位容器）**

在 Slack 安装区 `#install` `</section>` 之后插入：

```html
<!-- Pillar ② — desktop pet -->
<section id="pet" class="section section--pet">
  <div class="rule" aria-hidden="true"></div>
  <p class="section__kicker" data-reveal data-i18n="pet.kicker">Pillar ②</p>
  <h2 class="section__h" data-reveal data-i18n="pet.h">Give the AI a form.</h2>
  <p class="lede lede--wide" data-reveal data-i18n="pet.lede">
    cc-bot works in the channel, but it has no face. The desktop pet is that face —
    a small creature on your desktop that watches the channel, cares about the
    project, and keeps you company with a mood.
  </p>

  <!-- state board — populated in Task 6 -->
  <div class="pet-board" data-reveal aria-hidden="true"></div>

  <ol class="pet-cards">
    <li class="pet-card" data-reveal>
      <span class="pet-card__no">01</span>
      <h3 data-i18n="pet.1.title">One each</h3>
      <p data-i18n="pet.1.body">Every teammate has their own creature on their own desktop — same channel, each their own view.</p>
    </li>
    <li class="pet-card" data-reveal data-reveal-delay="80">
      <span class="pet-card__no">02</span>
      <h3 data-i18n="pet.2.title">Listens to the channel</h3>
      <p data-i18n="pet.2.body">Wired live into Slack / Lark — whatever happens in the channel, it knows.</p>
    </li>
    <li class="pet-card" data-reveal data-reveal-delay="160">
      <span class="pet-card__no">03</span>
      <h3 data-i18n="pet.3.title">Acts out the state</h3>
      <p data-i18n="pet.3.body">cc-bot compiling, deploying, erroring — the pet plays it out in expression and motion.</p>
    </li>
    <li class="pet-card" data-reveal data-reveal-delay="240">
      <span class="pet-card__no">04</span>
      <h3 data-i18n="pet.4.title">Has a personality</h3>
      <p data-i18n="pet.4.body">Not a status light — it answers messages, has moods and a temper, a partner that works beside you.</p>
    </li>
  </ol>

  <p class="pet__close" data-reveal data-i18n="pet.close">
    Give that AI dev teammate a face that moves and answers back.
  </p>
</section>
```

- [ ] **Step 2: app.js —— 新增桌宠区 i18n**

```js
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
```

- [ ] **Step 3: styles.css —— 桌宠区与卡片样式**

末尾追加（`.pet-cards` 复用现有 `.card` 网格语言）：

```css
/* ---- pillar ② : desktop pet ------------------------------------ */
.pet-cards {
  list-style: none;
  margin: clamp(28px, 5vw, 56px) 0 0;
  padding: 0;
  display: grid;
  gap: clamp(14px, 2vw, 22px);
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 900px) { .pet-cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .pet-cards { grid-template-columns: 1fr; } }
.pet-card {
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: clamp(20px, 2.6vw, 30px);
  background: var(--ink-2);
  transition: transform 0.4s var(--ease-out), border-color 0.4s var(--ease-out);
}
.pet-card:hover { transform: translateY(-4px); border-color: var(--signal); }
.pet-card__no {
  font-family: var(--f-mono);
  font-size: 0.8rem;
  color: var(--signal);
}
.pet-card h3 {
  font-family: var(--f-display);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  margin: 8px 0 8px;
}
.pet-card p { color: var(--bone-2); margin: 0; font-size: 0.95rem; }
.pet__close {
  margin-top: clamp(28px, 5vw, 52px);
  font-family: var(--f-display);
  font-size: clamp(1.2rem, 2.6vw, 1.9rem);
  color: var(--bone);
}
```

- [ ] **Step 4: 验证**

执行「浏览器验证流程」。重点：Slack 安装区之后出现「支柱 ②」桌宠区，标题 `给 AI 一个形象。`、导语、4 张卡（hover 抬升）、收尾大字句；状态板容器 `.pet-board` 当前为空属正常（Task 6 填充）；导航「桌宠」与支柱②卡链接点击滚到本区；中英切换正确。

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: pillar ② desktop-pet section — structure, cards, closing"
```

---

## Task 6: 桌宠区状态板（路线 1 — CSS 微变体占位）

**Files:**
- Modify: `index.html`（填充 Task 5 留下的 `<div class="pet-board">`）
- Modify: `styles.css`（末尾追加：`.pet-board` / `.pet-state` 样式）
- Modify: `app.js`（`translations` —— 4 个状态标签 key）

- [ ] **Step 1: index.html —— 填充状态板四格**

把 Task 5 的空 `<div class="pet-board" ...></div>` 替换为：

```html
<div class="pet-board" data-reveal>
  <figure class="pet-state pet-state--focus">
    <img class="pet-state__img" src="./assets/logo.png" alt="" width="80" height="80" />
    <figcaption><b data-i18n="pet.state.compiling">Compiling</b><span data-i18n="pet.state.focus">focused</span></figcaption>
  </figure>
  <figure class="pet-state pet-state--happy">
    <img class="pet-state__img" src="./assets/logo.png" alt="" width="80" height="80" />
    <figcaption><b data-i18n="pet.state.deployed">Deployed</b><span data-i18n="pet.state.happy">delighted</span></figcaption>
  </figure>
  <figure class="pet-state pet-state--alert">
    <img class="pet-state__img" src="./assets/logo.png" alt="" width="80" height="80" />
    <figcaption><b data-i18n="pet.state.error">Error</b><span data-i18n="pet.state.alert">alarmed</span></figcaption>
  </figure>
  <figure class="pet-state pet-state--idle">
    <img class="pet-state__img" src="./assets/logo.png" alt="" width="80" height="80" />
    <figcaption><b data-i18n="pet.state.idle">Idle</b><span data-i18n="pet.state.lazy">lazing</span></figcaption>
  </figure>
</div>
```

- [ ] **Step 2: app.js —— 新增状态标签 i18n**

```js
"pet.state.compiling": { en: "Compiling", zh: "编译中" },
"pet.state.focus":     { en: "focused",   zh: "专注" },
"pet.state.deployed":  { en: "Deployed",  zh: "部署成功" },
"pet.state.happy":     { en: "delighted", zh: "雀跃" },
"pet.state.error":     { en: "Error",     zh: "报错" },
"pet.state.alert":     { en: "alarmed",   zh: "警觉" },
"pet.state.idle":      { en: "Idle",      zh: "空闲" },
"pet.state.lazy":      { en: "lazing",    zh: "慵懒" },
```

- [ ] **Step 3: styles.css —— 状态板与四种 CSS 微变体**

末尾追加。路线 1：同一张 `logo.png`，用色调滤镜 + 位移/旋转区分四态。`.pet-state__img` 是替换点 —— 路线 2 换成专门表情图时只改 `src`、删 `filter`，结构不动：

```css
/* ---- pet state board (route 1 — CSS variants, swap-ready) ------- */
.pet-board {
  margin: clamp(28px, 5vw, 56px) 0 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(12px, 2vw, 20px);
}
@media (max-width: 620px) { .pet-board { grid-template-columns: repeat(2, 1fr); } }
.pet-state {
  margin: 0;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: clamp(18px, 2.4vw, 28px);
  background: var(--ink-2);
  text-align: center;
}
.pet-state__img {
  width: clamp(56px, 7vw, 80px);
  height: auto;
}
.pet-state figcaption { margin-top: 12px; display: flex; flex-direction: column; gap: 2px; }
.pet-state figcaption b { font-family: var(--f-mono); font-size: 0.85rem; }
.pet-state figcaption span { color: var(--muted); font-size: 0.8rem; }

/* four moods — micro-variations on the one logo creature */
.pet-state--focus .pet-state__img {
  filter: saturate(1.15);
  animation: pet-focus 1.6s var(--ease-in-out) infinite;
}
.pet-state--happy .pet-state__img {
  filter: hue-rotate(-12deg) saturate(1.3) brightness(1.1);
  animation: pet-happy 0.9s var(--ease-out) infinite;
}
.pet-state--alert .pet-state__img {
  filter: hue-rotate(-40deg) saturate(1.5) brightness(1.05);
  animation: pet-alert 0.4s steps(2) infinite;
}
.pet-state--idle .pet-state__img {
  filter: saturate(0.7) brightness(0.85);
  animation: pet-idle 4.5s var(--ease-in-out) infinite;
}
@keyframes pet-focus { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes pet-happy { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-9px) rotate(6deg)} }
@keyframes pet-alert { 0%{transform:translateX(-3px)} 100%{transform:translateX(3px)} }
@media (prefers-reduced-motion: reduce) {
  .pet-state__img { animation: none !important; }
}
```

> `pet-idle` keyframes 已在 Task 2 定义，此处复用，勿重复声明。

- [ ] **Step 4: 验证**

执行「浏览器验证流程」。重点：桌宠区导语下方出现四格状态板（编译中/专注、部署成功/雀跃、报错/警觉、空闲/慵懒），四只生物色调与动作各异；`prefers-reduced-motion` 下动效停止（可在 chrome-devtools `emulate` 或系统设置验证）；中英切换状态标签正确。

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: pet state board (route 1 — CSS mood variants)"
```

---

## Task 7: CTA + 页脚平台化

**Files:**
- Modify: `index.html`（`.section--cta` 文案节点、`<footer>` 品牌与 tag）
- Modify: `app.js`（`translations` —— `cta.*` / `foot.*`）

- [ ] **Step 1: app.js —— CTA 文案平台化**

```js
"cta.h": { en: "Ship from where the team already talks.", zh: "在团队本来就在聊的地方发布。" },
"cta.p": {
  en: `sintbot is MIT and runtime-free. cc-bot's Slack &amp; Lark adapters are live on <code>main</code>; the desktop pet is on the way.`,
  zh: `sintbot 采用 MIT、无外部运行时。cc-bot 的 Slack 与飞书适配器已在 <code>main</code> 分支；桌宠在路上。`
},
"cta.repo": { en: "Open the repo", zh: "打开仓库" },
```

（`cta.h` / `cta.repo` 若与现值相同则保持；`cta.p` 必改为含桌宠的平台措辞。）

- [ ] **Step 2: app.js —— 页脚平台化**

```js
"foot.tag": {
  en: `v${VERSION} · MIT · Local-first · IM-agnostic`,
  zh: `v${VERSION} · MIT · 本地优先 · IM 无关`
},
"foot.meta": {
  en: "sintbot showcase — rouserlab editorial pacing, the-field motion. Not affiliated with Slack, Lark, or Anthropic.",
  zh: "sintbot 展示站点 —— 节奏取自 rouserlab，动作取自 the-field。与 Slack、飞书、Anthropic 无任何隶属关系。"
},
```

（`foot.tag` 沿用 Task 已有的 `VERSION` 模板字符串，保持单一来源。）

- [ ] **Step 3: index.html —— 页脚品牌字标**

`<footer>` 内 `<strong>cc-bot</strong>` 改为 `<strong>sintbot</strong>`。`<img>` logo、结构不变。

- [ ] **Step 4: （可选）GoatCounter 新增 2 个事件**

如需，在 `app.js` 第 6 节埋点处**追加**（不动现有 6 个事件）：

```js
// pillar card clicks
document.querySelectorAll('.pillar__link').forEach((a) => {
  a.addEventListener("click", () => track("pillar-click", "Pillar card: " + a.getAttribute("href")));
});
```

桌宠区到达已被现有 `section[id]` observer 自动覆盖（`#pet` 有 id），无需额外代码。

- [ ] **Step 5: 验证**

执行「浏览器验证流程」。重点：CTA 段提到桌宠、措辞为平台级；页脚字标为 `sintbot`、tag 含版本号、meta 为「sintbot 展示站点」；中英切换正确；（若做了埋点）console 无报错。

- [ ] **Step 6: Commit**

```bash
git add index.html app.js
git commit -m "feat: platform-level CTA and footer"
```

---

## Task 8: 全站验证 + 合并上线

**Files:** 无（验证 + git）

- [ ] **Step 1: 全站双语通检**

浏览器加载 `http://localhost:8765/`，从上到下目检：导航 → 平台 hero（桌宠形象 + idle）→ 平台引入区（两支柱卡）→ 支柱 ① 引子（agent 槽位）→ 现有 6 段（kicker `①·01`–`①·06`、正文/SVG 未变）→ 支柱 ② 桌宠区（状态板 + 4 卡 + 收尾）→ CTA → 页脚。切到中文再走一遍。

- [ ] **Step 2: console 与锚点检查**

`list_console_messages`：除 `goatcounter ... localhost` 外无 `error`/`warn`。逐个点击导航 `机器人`/`桌宠`/`接入` 与两张支柱卡链接，确认平滑滚动到位（`#bot` / `#pet` / `#install` 均存在）。

- [ ] **Step 3: Windows Chrome 实测**

按 `CLAUDE.md`：在 Windows Chrome 实测光标辉光跟随、PCB 走线动效、hero 桌宠 idle、状态板四态动效；检查触摸屏混合设备 pointer 无误判。

- [ ] **Step 4: 合并到 main**

```bash
git checkout main
git merge --no-ff redesign/sintbot-platform -m "feat: sintbot platform redesign"
git push origin main
```

- [ ] **Step 5: 线上验证**

GitHub Pages 部署后（约 30–60s）：

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://sintbot.com
```

Expected: `200`。再用 chrome-devtools 加载 `https://sintbot.com/`，`ignoreCache: true`，目检桌宠区与平台结构均上线、console 无报错。

---

## 待定项（不阻塞本计划）

- **多模型名单**：Codex / Google(Gemini) / 本土模型 等候选待定。定下后只需补 Task 4 的 `agent-slot` 项与 `bot.slot.*` 文案。
- **桌宠表情图（路线 2）**：生成 4–5 张专门桌宠表情精灵图后，替换 Task 6 状态板各 `.pet-state__img` 的 `src`、移除对应 `filter`，结构与 i18n 不动。

## 自审记录

- **Spec 覆盖**：导航/meta→T1；hero+桌宠形象→T2；平台引入区→T3；模型层引子+重编号→T4；现有内容保留→T4 Step3 明确仅改 kicker；桌宠区+状态板→T5/T6；CTA/页脚→T7；i18n→各 Task 内含 EN+zh；零构建/验证→通用约定 + T8。spec 第 9 节待定项→本计划「待定项」。无遗漏。
- **占位符扫描**：无 TBD/TODO；每个改动步骤含实际代码与文案。
- **类型/命名一致性**：`#what`/`#bot`/`#pet` 锚点 ID 在导航(T1)、hero CTA(T2)、支柱卡(T3)、各区块(T3/T4/T5) 间一致；`.pet-board`/`.pet-state__img` 在 T5 建容器、T6 填充并复用；`pet-idle` keyframes 在 T2 定义、T6 复用且已注明勿重复声明；`VERSION` 模板字符串在 T7 沿用既有单一来源。
