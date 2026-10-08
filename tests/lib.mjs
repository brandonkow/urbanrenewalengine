// Shared helpers for the engine tests.
// The engine is one self-contained HTML file, so every test opens app/index.html in headless
// Chromium (offline: fonts and any network request are blocked) and calls the engine's own
// global functions from inside the page.
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const APP = pathToFileURL(path.join(ROOT, 'app', 'index.html')).href;

// Set CHROMIUM_PATH to use a Chromium you already have instead of `npx playwright install chromium`.
export async function launch() {
  return chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
}

export async function openEngine(browser, hash = '#/watchlist', viewport = { width: 1440, height: 1000 }) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/fonts|ERR_FAILED|net::/i.test(m.text())) errors.push('console: ' + m.text());
  });
  await page.route('**/*', (r) => (r.request().url().startsWith('file:') ? r.continue() : r.abort()));
  await page.goto(APP + hash);
  await page.waitForTimeout(400);
  return { page, errors };
}

export function report(title, lines, fails, errors, total) {
  console.log(`\n${title}`);
  for (const l of lines) console.log('  ' + l);
  console.log(`  ${fails || errors.length ? 'FAILED' : 'OK'}: ${total ?? lines.length} checks, ${fails} failing${errors.length ? `, ${errors.length} page errors` : ''}`);
  for (const e of errors) console.log('  page error: ' + e);
  return fails === 0 && errors.length === 0;
}
