// cc-bot showcase — vanilla JS for reveal-on-scroll, copy buttons,
// soft cursor glow, per-element reveal delays, and EN/zh-CN i18n.
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 0) i18n ----------------------------------------------------------------
  // Code blocks, command names and identifiers stay English in both modes.
  const translations = {
    "nav.scenarios":     { en: "Scenarios",      zh: "场景" },
    "nav.capabilities":  { en: "Capabilities",   zh: "能力" },
    "nav.architecture":  { en: "Architecture",   zh: "架构" },
    "nav.setup":         { en: "Setup",          zh: "接入" },

    "hero.eyebrow":      { en: "v0.1.12 · Slack adapter shipped · MIT",
                           zh: "v0.1.12 · Slack 适配器已发布 · MIT" },
    "hero.titleEn":      {
      en: `<span data-reveal data-reveal-delay="0">Slack-native</span>
           <em data-reveal data-reveal-delay="120">Claude&nbsp;Code.</em>
           <span data-reveal data-reveal-delay="240">Ship from chat.</span>`,
      zh: `<span data-reveal data-reveal-delay="0">把 Claude Code</span>
           <em data-reveal data-reveal-delay="120">放进 Slack。</em>
           <span data-reveal data-reveal-delay="240">在群里发布。</span>`
    },
    "hero.lede":         {
      en: "Mention cc-bot in any Slack channel. It reads the thread, runs your scripts, opens PRs, replies in place. Lark / Feishu through the same IMAdapter.",
      zh: "在任意 Slack 频道 @cc-bot。它读上下文、跑脚本、开 PR、就地回复。飞书走同一套 IMAdapter。"
    },
    "hero.cta.primary":   { en: "Set up the Slack app",     zh: "配置 Slack 应用" },

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

    "scenarios.kicker": { en: "00 — In your workspace", zh: "00 — 在你的工作区里" },
    "scenarios.h": {
      en: `Where <em>cc-bot</em> earns its keep.`,
      zh: `<em>cc-bot</em> 真正发力的地方。`
    },
    "scenarios.lede": {
      en: "Five channels, five jobs. Ask in chat, get an answer, keep working.",
      zh: "五个频道、五种活儿。群里问一句，拿到答案，继续干。"
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

    "cap.kicker": { en: "01 — Capabilities", zh: "01 — 能力" },
    "cap.h":      { en: "Six muscles, one bot.", zh: "一个 bot，六块肌肉。" },

    "cap.1.title": { en: "Slack-native, IM-agnostic", zh: "原生 Slack，IM 无关" },
    "cap.1.body":  {
      en: `Socket Mode push — no public webhook, works behind firewalls. The same <code>IMAdapter</code> powers Lark. The next adapter is one file.`,
      zh: `Socket Mode 推送，无需公网 webhook，能穿透防火墙。同一套 <code>IMAdapter</code> 也支撑飞书，下一个接入只是新增一个文件。`
    },
    "cap.2.title": { en: "Defensive delivery", zh: "防御式投递" },
    "cap.2.body":  {
      en: "Push events are triangulated against a short-poll fallback and a dedupe ledger. Every message delivered exactly once.",
      zh: "推送事件与短轮询互为兜底，去重账本兜在最后一道，每条消息只投递一次。"
    },
    "cap.3.title": { en: "Multi-agent scheduling", zh: "多 Agent 调度" },
    "cap.3.body":  {
      en: "Slots and tags turn parallel Claude sessions into a polite queue. Conflicts resolved by config, not chance.",
      zh: "slot 与 tag 把并行的 Claude 会话排成有序队列。冲突由配置决定，不靠运气。"
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

    "adapter.kicker": { en: "02 — Engineering note", zh: "02 — 工程笔记" },
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

    "arch.kicker": { en: "03 — Architecture", zh: "03 — 架构" },
    "arch.h":      { en: "A small idea, drawn carefully.", zh: "一个小想法，画得仔细。" },
    "arch.lede":   {
      en: "A thin pipeline. Events in via Socket Mode (Lark polls HTTP). Dedupe ledger guarantees exactly-once. Scheduler hands the message to Claude Code under the right permission tier. Result flows back to channel and HUD together.",
      zh: "一条很薄的管线。事件经 Socket Mode 进入（飞书走 HTTP 轮询），去重账本保证只投一次。调度器在对应权限层把消息交给 Claude Code，结果同时流回频道和 HUD。"
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

    "install.kicker": { en: "04 — Slack setup", zh: "04 — Slack 接入" },
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
      en: `MIT, runtime-free, on GitHub. Slack &amp; Lark adapters both live on <code>main</code>.`,
      zh: `MIT 协议，无外部运行时，在 GitHub。Slack 与飞书适配器都在 <code>main</code> 分支。`
    },
    "cta.repo": { en: "Open the repo", zh: "打开仓库" },

    "foot.tag":     { en: "v0.1.12 · MIT · Slack-first, IM-agnostic", zh: "v0.1.12 · MIT · Slack 优先，IM 无关" },
    "foot.meta":    {
      en: "Showcase site — rouserlab editorial pacing, the-field motion. Not affiliated with Slack, Lark, or Anthropic.",
      zh: "展示站点——节奏取自 rouserlab，动作取自 the-field。与 Slack、飞书、Anthropic 无任何隶属关系。"
    },

    "copy": { en: "copy", zh: "复制" }
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
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      let raf = 0;
      let tx = window.innerWidth / 2;
      let ty = window.innerHeight / 2;
      let cx = tx;
      let cy = ty;
      document.body.classList.add("cursor-on");
      window.addEventListener(
        "mousemove",
        (e) => {
          tx = e.clientX;
          ty = e.clientY;
          if (!raf) raf = requestAnimationFrame(tick);
        },
        { passive: true }
      );
      window.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-on");
      });
      window.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-on");
      });
      function tick() {
        // gentle lerp for trailing motion
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

  // 4) Subtle parallax on hero marquee -----------------------------------
  if (!prefersReducedMotion) {
    const marquee = document.querySelector(".hero__marquee-track");
    if (marquee) {
      let lastY = 0;
      let raf2 = 0;
      const onScroll = () => {
        lastY = window.scrollY;
        if (!raf2) raf2 = requestAnimationFrame(applyParallax);
      };
      const applyParallax = () => {
        // marquee already auto-scrolls; we add a vertical drift for depth
        const offset = Math.min(lastY * 0.08, 60);
        marquee.style.translate = `0 ${offset}px`;
        raf2 = 0;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
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
})();
