// Run: node tests/domain-gate.test.ts  (Node ≥ 22.18 strips TypeScript types natively)
import assert from 'node:assert/strict';
import { gate } from '../netlify/edge-functions/domain-gate.ts';

const target = (u: string) => gate(new URL(u))?.href;

// development hosts pass through untouched
for (const u of [
  'https://fiaril-orthopedics.netlify.app/',
  'https://fiaril-orthopedics.netlify.app/lab/f03-living-anatomy/',
  'https://deploy-preview-3--fiaril-orthopedics.netlify.app/lab/',
  'http://localhost:8888/lab/',
]) assert.equal(target(u), undefined, u);

// official hosts: every page and asset outside /maintenance/ is rewritten to it
for (const host of ['fiarilorthopedics.com.mx', 'www.fiarilorthopedics.com.mx', 'alias.example.com']) {
  for (const p of ['/', '/lab/', '/lab/f01-dot-field/', '/_astro/stage.js', '/favicon.ico', '/maintenance', '/no-existe?x=1']) {
    assert.equal(target(`https://${host}${p}`), `https://${host}/maintenance/`, host + p);
  }
  // the page itself and its assets are served (no loop)
  for (const p of ['/maintenance/', '/maintenance/logo.webp', '/maintenance/manrope-latin.woff2']) {
    assert.equal(target(`https://${host}${p}`), undefined, host + p);
  }
}

// a lookalike host must not count as Netlify
assert.equal(target('https://evilnetlify.app/lab/'), 'https://evilnetlify.app/maintenance/');

console.log('domain-gate: all checks passed');
