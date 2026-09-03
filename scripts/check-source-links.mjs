#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'src', 'content', 'articles');
const urls = new Set();
for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md'))) {
  const body = fs.readFileSync(path.join(dir, file), 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
  for (const match of body.matchAll(/https?:\/\/[^\s)\]>"']+/gi)) urls.add(match[0]);
}
const queue = [...urls];
const results = [];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'AvrupaGazetesiEditorialAudit/1.0' } });
      results.push({ url, status: response.status, finalUrl: response.url });
      await response.body?.cancel();
    } catch (error) {
      results.push({ url, status: 0, error: error.name === 'AbortError' ? 'timeout' : String(error.message ?? error) });
    } finally { clearTimeout(timer); }
  }
}
await Promise.all(Array.from({ length: 12 }, worker));
const failed = results.filter((item) => item.status === 0 || item.status >= 400);
console.log(JSON.stringify({ checked: results.length, reachable: results.length - failed.length, failed: failed.length }, null, 2));
for (const item of failed.sort((a, b) => a.status - b.status || a.url.localeCompare(b.url))) console.log(`${item.status || item.error}\t${item.url}`);
if (failed.some((item) => item.status === 404 || item.status === 410)) process.exitCode = 1;
