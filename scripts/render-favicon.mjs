#!/usr/bin/env node
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public');

const html = `
<!doctype html>
<html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nabla&display=block">
<style>
  html, body { margin: 0; padding: 0; background: transparent; }
  body {
    width: 512px; height: 512px;
    display: grid; place-items: center;
    font-family: 'Nabla', sans-serif;
    font-size: 300px;
    line-height: 1;
    letter-spacing: -0.04em;
  }
</style></head>
<body><span>MN</span></body></html>
`;

const master = resolve(outDir, 'favicon-512.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(150);
await page.screenshot({ path: master, omitBackground: true, type: 'png' });
await browser.close();
console.log(`wrote ${master} (512x512 master)`);

// Downscale the master to the smaller sizes using macOS `sips` (built-in, no deps).
for (const size of [256, 180, 32]) {
  const name = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
  const out = resolve(outDir, name);
  spawnSync('cp', [master, out]);
  const r = spawnSync('sips', ['-Z', String(size), out], { stdio: 'pipe' });
  if (r.status !== 0) console.error(`sips failed for ${name}`, r.stderr?.toString());
  else console.log(`wrote ${out} (${size}x${size})`);
}
