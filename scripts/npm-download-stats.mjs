#!/usr/bin/env node

// Report daily npm package download requests for the completed UTC days.
// These counts are not unique installations.

import { appendFileSync, writeFileSync } from "node:fs";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1];
}

const days = Number(option("--days", "30"));
const jsonOut = option("--json-out", "");

if (!Number.isInteger(days) || days < 1 || days > 365) {
  throw new Error("--days must be an integer between 1 and 365");
}

const utcToday = new Date();
utcToday.setUTCHours(0, 0, 0, 0);

function utcDay(offset) {
  const date = new Date(utcToday);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

const start = utcDay(-days);
const end = utcDay(-1);
const url = `https://api.npmjs.org/downloads/range/${start}:${end}/sintbot`;
const response = await fetch(url, {
  headers: { accept: "application/json" },
  signal: AbortSignal.timeout(30_000),
});

if (!response.ok) {
  throw new Error(`npm downloads API returned HTTP ${response.status}`);
}

const result = await response.json();
if (result.package !== "sintbot" || result.start !== start || result.end !== end || !Array.isArray(result.downloads)) {
  throw new Error("npm downloads API returned an unexpected response");
}

const byDay = new Map(result.downloads.map(({ day, downloads }) => [day, downloads]));
const downloads = [];
for (let offset = -days; offset <= -1; offset += 1) {
  const day = utcDay(offset);
  const count = byDay.get(day);
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`npm downloads API omitted or invalidated ${day}`);
  }
  downloads.push({ day, downloads: count });
}

const report = {
  package: "sintbot",
  metric: "npm package download requests",
  timezone: "UTC",
  start,
  end,
  total: downloads.reduce((sum, item) => sum + item.downloads, 0),
  downloads,
};

const markdown = [
  `## npm downloads: ${start} to ${end} (UTC)`,
  "",
  `Total: **${report.total}** package download requests. These are not unique installations.`,
  "",
  "| UTC date | Downloads |",
  "| --- | ---: |",
  ...downloads.map(({ day, downloads: count }) => `| ${day} | ${count} |`),
  "",
].join("\n");

console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}
if (jsonOut) {
  writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);
}
