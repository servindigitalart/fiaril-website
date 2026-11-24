// Domain gate: the official domain shows only the temporary page; *.netlify.app keeps the full site.
// Fail-closed: any host that is not a Netlify subdomain or localhost gets the temporary page,
// so a future domain alias can't expose the development site by accident.
// To publish the full site on the official domain: docs/11-domain-gate.md.

const OPEN_HOSTS = /(^|\.)netlify\.app$|^localhost$|^127\.0\.0\.1$/;
const PAGE = '/maintenance/';

export function gate(url: URL): URL | undefined {
  if (OPEN_HOSTS.test(url.hostname)) return; // development host: untouched
  if (url.pathname.startsWith(PAGE)) return; // the page and its own assets: serve as-is (stops rewrite loops)
  return new URL(PAGE, url); // everything else: same-site rewrite, 200, address bar unchanged
}

export default (request: Request) => gate(new URL(request.url));

export const config = {
  path: '/*',
  // Netlify internals and ACME / well-known files (certificate renewal) must never be rewritten.
  excludedPath: ['/.netlify/*', '/.well-known/*'],
};
