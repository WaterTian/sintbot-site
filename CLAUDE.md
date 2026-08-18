# sintbot-site

**sintbot 平台**的展示 / 宣传网站。纯静态、单页、双语 EN/中。线上：https://sintbot.com

sintbot 含两根支柱：① **多模型群聊机器人**；② **桌宠** —— 趴桌面、**会说话、出声反应**、有性格的虚拟伙伴（注意口径：2026-07 起已从「演开发状态」改成「出声反应」，见提交 `7b0feba` / `1f4df31`，站上文案勿再往状态展示上写）。单页同时呈现这两部分。

### ⚠ 支柱① 是双层的（2026-08-18 起）

| | 形态 | 归属 |
|---|---|---|
| **cc-bot** | **插件** —— 装进 Claude Code，活在交互会话里，绑死该会话的模型 | Free，MIT，公开仓 `WaterTian/cc-bot` |
| **sintbot** | **独立守护进程** —— 自带消息循环、无需人守终端，无头驱动 **Claude Code 与 Codex 两套 agent**，背后模型可换（Claude / GPT / GLM / DeepSeek / MiniMax） | **Pro 付费后交付**，私有仓，当前面向飞书 |

**命名铁律**：Pro 版守护进程在站上一律叫 **`sintbot`**（品牌大写 `Sintbot`）。**内部代号与历史代号一律不上站**（含仓库名 `sbot` 及更早的部署代号）——对外只有 sintbot 这一个名字。本仓库是 Public，连本文件也算对外，写之前先想清楚。

**别把 sintbot 写成可公开下载** —— 它不是公开仓，交付走「订阅后邮件取件」。**站上写的每一句承诺都会被按字面读**，涉及付费、交付、退订的文案，写之前先确认对应通道真的存在；背景与判据见 `../sintbot-ops/business/creem/`。

## 技术栈

纯 **HTML / CSS / JS**，零构建工具、零依赖、零框架。单页应用（`index.html`）。

## 文件

- `index.html` — 页面结构
- `styles.css` — 全部样式，原生 CSS 自定义属性，PCB 电路板配色
- `app.js` — 全部行为：i18n、滚动揭示、光标辉光、复制按钮、Umami 埋点、logo-cycle、hero 视差
- `assets/` — logo 等静态资源
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
- 站点接了 **Umami** 统计（cloud.umami.is，script 标签在 `index.html` head）；改 `app.js` 时勿误删 section 6 的 `umami.track()` 事件埋点
- 项目记忆里有更多踩坑经验（光标辉光跨平台、导航 PCB 走线动效、域名配置等），动手前可查
- **公开仓库数据红线**：本仓库是 Public，任何提交全网可见，且历史一旦被抓取就无法真正
  撤回。运营/账号/业务文档（含任何个人邮箱、账号信息、后台状态）一律放平级私有仓库
  `../sintbot-ops/`，**永不 commit 到本仓库**；`.scratch/` 只放一次性草稿（已 gitignore）。
  git 提交身份用 noreply 邮箱（仓库级 git config 已设好）。

## 当前状态

`sintbot.com` 已完全上线，HTTPS 强制已开启（Let's Encrypt 证书 `CN=sintbot.com`，`http://` 自动 301 跳 HTTPS）。域名与部署链路无遗留待办。

唯一长期事项：Namecheap 域名自动续费已关闭，**2027-04 前需手动续费**。
