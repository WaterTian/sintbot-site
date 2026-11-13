#!/usr/bin/env node
// Derive share metadata and structured data from the directly maintained guide pages.
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');
const files = ['guide/install/index.html', 'guide/usage/index.html', 'zh/guide/install/index.html', 'zh/guide/usage/index.html'];
const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<');
let stale = false;
for (const file of files) {
  const path = new URL(file, root);
  const original = readFileSync(path, 'utf8');
  const title = decode(original.match(/<title>([^<]+)<\/title>/)?.[1] || '');
  const description = decode(original.match(/<meta name="description" content="([^"]+)"/)?.[1] || '');
  const url = original.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!title || !description || !url) throw Error(`Missing guide metadata: ${file}`);
  const zh = file.startsWith('zh/');
  const image = `https://sintbot.com/assets/og-banner${zh ? '-zh' : ''}.png?v=20261113`;
  const graph = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'TechArticle', '@id': `${url}#article`, headline: title, description, url,
        mainEntityOfPage: url, inLanguage: zh ? 'zh-CN' : 'en', image,
        author: { '@type': 'Person', name: 'WaterTian', url: 'https://github.com/WaterTian' },
        publisher: { '@type': 'Organization', name: 'SintLab', url: 'https://sintlab.com/' } },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'SintBot', item: `https://sintbot.com/${zh ? 'zh/' : ''}` },
        { '@type': 'ListItem', position: 2, name: title, item: url },
      ] },
    ],
  };
  let html = original.replace(/\n?<!-- Guide SEO: generated -->[\s\S]*?<!-- End guide SEO -->\n?/g, '');
  // These tags were absent or pointed at a favicon before the shared image existed.
  html = html.replace(/<meta (?:property="og:image(?::[^\"]*)?"|name="twitter:[^\"]*") content="[^"]*"\s*\/?>(?:\n)?/g, '');
  const tags = `\n<!-- Guide SEO: generated -->\n<meta property="og:image" content="${image}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="${escape(title)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escape(title)}">\n<meta name="twitter:description" content="${escape(description)}">\n<meta name="twitter:image" content="${image}">\n<script type="application/ld+json">${JSON.stringify(graph).replaceAll('<', '\\u003c')}</script>\n<!-- End guide SEO -->\n`;
  html = html.replace('</head>', tags + '</head>');
  if (html !== original) {
    stale = true;
    if (!check) writeFileSync(path, html);
  }
}
if (check && stale) { console.error('Guide SEO is stale: run node scripts/build-guide-seo.mjs'); process.exitCode = 1; }
else console.log(check ? 'Guide SEO: up to date' : 'Guide SEO: generated 4 pages');
