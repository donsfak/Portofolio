// Suite de tests de résistance du portfolio (Playwright, Chromium headless).
// Usage : npm run build && npm run preview -- --port 4173  puis  npm run test:resilience
// (premier lancement : npx playwright-core install chromium)
import { chromium } from 'playwright-core';

const BASE = process.argv[2] || 'http://localhost:4173';
const results = [];
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch();

async function newPage({ realGithub = false, ...opts } = {}, init) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, ...opts });
  if (init) await ctx.addInitScript(init);
  // GitHub API mocked so results don't depend on this machine's 60 req/h quota
  if (!realGithub) await ctx.route(/api\.github\.com/, r => r.fulfill({ json: r.request().url().includes('/repos') ? [] : { followers: 1, public_repos: 1, total_count: 1 } }));
  const page = await ctx.newPage();
  const log = { errors: [], csp: [], failed: [], dialogs: [] };
  page.on('pageerror', e => log.errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') {
      const txt = m.text();
      (/Content Security Policy/i.test(txt) ? log.csp : log.errors).push(txt.slice(0, 160));
    }
  });
  page.on('response', r => { if (r.status() >= 400) log.failed.push(`${r.status()} ${r.url().replace(BASE, '')}`); });
  page.on('dialog', async d => { log.dialogs.push(d.message()); await d.dismiss(); });
  return { ctx, page, log };
}
const rootFilled = page => page.evaluate(() => (document.getElementById('root')?.innerText || '').length > 500);

// 1. Chargement nominal ──────────────────────────────────────────────────────
{
  const { ctx, page, log } = await newPage();
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const loadMs = Date.now() - t0;
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await page.waitForTimeout(1500);
  const broken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')));
  record('Chargement nominal (networkidle)', await rootFilled(page), `${loadMs} ms`);
  record('Aucune erreur JS', log.errors.length === 0, log.errors.slice(0, 3).join(' | '));
  record('Aucune violation CSP', log.csp.length === 0, log.csp.slice(0, 3).join(' | '));
  record('Aucune ressource en erreur (4xx/5xx)', log.failed.length === 0, log.failed.slice(0, 5).join(', '));
  record('Aucune image cassée', broken.length === 0, broken.join(', '));
  await ctx.close();
}

// 2. Services tiers indisponibles (GitHub API, skillicons, Google Fonts, calendrier)
{
  const { ctx, page, log } = await newPage();
  await ctx.route(/api\.github\.com|jogruber|skillicons\.dev|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const sections = await page.evaluate(() => ['about', 'experience', 'projects', 'skills', 'contact'].every(id => document.getElementById(id)));
  record('Tiers coupés : la page reste utilisable', (await rootFilled(page)) && sections && log.errors.filter(e => !/Failed to fetch|net::|GitHub/i.test(e)).length === 0);
  await ctx.close();
}

// 3. Fichiers de traduction indisponibles
{
  const { ctx, page } = await newPage();
  await ctx.route(/\/locales\//, r => r.fulfill({ status: 404, body: '' }));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const rawKeys = await page.evaluate(() => (document.body.innerText.match(/\b(nav|hero|about|contact)\.[a-zA-Z]+/g) || []).length);
  record('Traductions en 404 : pas de clés brutes affichées', rawKeys === 0, `${rawKeys} clés i18n brutes visibles (ex. "nav.about")`);
  await ctx.close();
}

// 4. Réseau lent (≈ 3G : 400 kb/s, 400 ms RTT)
{
  const { ctx, page } = await newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 50_000, uploadThroughput: 50_000 });
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForSelector('h1', { timeout: 90_000 });
  const ms = Date.now() - t0;
  record('Réseau 3G : titre visible en < 10 s', ms < 10_000, `${(ms / 1000).toFixed(1)} s`);
  await ctx.close();
}

// 5. localStorage / sessionStorage corrompus
for (const [label, init] of [
  ['thème invalide avec espace', () => localStorage.setItem('theme', 'dark mode')],
  ['thème = payload HTML', () => localStorage.setItem('theme', '"><img src=x onerror=alert(1)>')],
  ['cache GitHub JSON corrompu', () => localStorage.setItem('github-stats-cache', '{not json')],
]) {
  const { ctx, page, log } = await newPage({}, init);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  record(`Stockage corrompu (${label}) : pas d'écran blanc`, await rootFilled(page), log.errors.slice(0, 1).join(''));
  await ctx.close();
}

// 5b. GitHub rate-limit (403) avec un cache expiré : on garde les dernières stats
{
  const stale = JSON.stringify({ timestamp: 0, data: { followers: 42, publicRepos: 15, totalStars: 3, totalCommits: 120, recentRepos: [] } });
  const { ctx, page } = await newPage({ realGithub: true });
  await ctx.addInitScript(s => localStorage.setItem('github-stats-cache', s), stale);
  await ctx.route(/api\.github\.com/, r => r.fulfill({ status: 403, json: { message: 'API rate limit exceeded' } }));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const shown = await page.evaluate(() => document.body.innerText.includes('42'));
  record('GitHub limité (403) : dernières stats affichées', shown);
  await ctx.close();
}

// 6. Injections XSS : formulaire de contact + hash d'URL
{
  const { ctx, page, log } = await newPage();
  await ctx.route(/^mailto:/, r => r.abort());
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const payload = `<img src=x onerror="alert('xss')"><script>alert(1)</script>"';--`;
  await page.fill('input[name=from_name]', payload);
  await page.fill('input[name=from_email]', 'a@b.co');
  await page.fill('input[name=subject]', payload);
  await page.fill('textarea[name=message]', payload.repeat(200));
  const msgLen = await page.$eval('textarea[name=message]', el => el.value.length);
  await page.evaluate(() => { window.open = () => null; });
  await page.click('form button[type=submit]');
  await page.waitForTimeout(500);
  record('Formulaire : payload XSS non exécuté', log.dialogs.length === 0);
  record('Formulaire : maxLength appliqué (3000)', msgLen <= 3000, `${msgLen} caractères acceptés`);

  for (const h of ['#<img src=x onerror=alert(1)>', '#javascript:alert(1)', '#/etude-de-cas/data-tour-2026', '#/etude-de-cas/../../etc', '#' + 'A'.repeat(50_000)]) {
    await page.evaluate(x => { window.location.hash = x; }, h);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => { window.location.hash = ''; });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => document.body.style.overflow);
  record('Hash d’URL piégés : rien exécuté', log.dialogs.length === 0);
  record('Étude de cas ouverte puis fermée : scroll restauré', overflow === '', `body.overflow="${overflow}"`);
  await ctx.close();
}

// 7. Honeypot anti-spam
{
  const { ctx, page } = await newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  let opened = false;
  await page.exposeFunction('__opened', () => { opened = true; });
  await page.evaluate(() => { window.open = () => { window.__opened(); return null; }; });
  await page.$eval('input[name=company]', el => { el.value = 'SpamBot Inc'; });
  for (const [s, v] of [['input[name=from_name]', 'Bot'], ['input[name=from_email]', 'b@b.co'], ['input[name=subject]', 'x'], ['textarea[name=message]', 'spam']]) await page.fill(s, v);
  await page.click('form button[type=submit]');
  await page.waitForTimeout(300);
  record('Honeypot : un bot ne déclenche pas d’envoi', !opened);
  await ctx.close();
}

// 8. Stress d’interactions + fuite mémoire
{
  const { ctx, page, log } = await newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const cdp = await ctx.newCDPSession(page);
  const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); return (await page.evaluate(() => performance.memory.usedJSHeapSize)) / 1e6; };
  const before = await heap();
  const t0 = Date.now();
  for (let i = 0; i < 300; i++) await page.evaluate(y => window.scrollTo(0, y), (i % 2) ? 0 : 4000 + i);
  const themeBtn = page.locator('nav .hidden.md\\:flex button').last();
  for (let i = 0; i < 100; i++) await themeBtn.click();
  const langBtn = page.locator('nav .hidden.md\\:flex button').first();
  for (let i = 0; i < 40; i++) await langBtn.click();
  const demo = page.getByRole('button', { name: /Captures|Screenshots/i }).first();
  for (let i = 0; i < 30; i++) {
    await demo.click();
    await page.mouse.click(5, 5);
    await page.waitForTimeout(30);
  }
  const after = await heap();
  record('Stress (300 scrolls, 100 thèmes, 40 langues, 30 modales) : 0 erreur', log.errors.length === 0, `${((Date.now() - t0) / 1000).toFixed(1)} s, ${log.errors.slice(0, 2).join(' | ')}`);
  record('Pas de fuite mémoire notable (< +10 Mo)', after - before < 10, `${before.toFixed(1)} → ${after.toFixed(1)} Mo`);
  await ctx.close();
}

// 9. Rendus pendant le scroll (coût CPU)
{
  const { ctx, page } = await newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const res = await page.evaluate(async () => {
    let longTasks = 0;
    new PerformanceObserver(l => { longTasks += l.getEntries().length; }).observe({ type: 'longtask', buffered: false });
    const t0 = performance.now();
    for (let y = 0; y < 6000; y += 40) { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); }
    return { ms: performance.now() - t0, longTasks };
  });
  record('Scroll fluide (aucune tâche > 50 ms)', res.longTasks === 0, `${res.longTasks} long tasks sur ${Math.round(res.ms)} ms`);
  await ctx.close();
}

// 10. Mobile 360 px
{
  const { ctx, page } = await newPage({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  record('Mobile 360 px : pas de scroll horizontal', over <= 0, `${over}px de débordement`);
  await ctx.close();
}

// 11. Accessibilité de base
{
  const { ctx, page } = await newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const a11y = await page.evaluate(() => ({
    unnamedButtons: [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length,
    unlabeled: [...document.querySelectorAll('input:not([type=hidden]):not([name=company]), textarea')].filter(i => !(i.id && document.querySelector(`label[for="${i.id}"]`)) && !i.getAttribute('aria-label')).length,
    nestedInteractive: document.querySelectorAll('a button, button a').length,
    unnamedLinks: [...document.querySelectorAll('a')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label')).length,
  }));
  record('A11y : boutons ont un nom accessible', a11y.unnamedButtons === 0, `${a11y.unnamedButtons} sans nom`);
  record('A11y : liens icônes ont un nom accessible', a11y.unnamedLinks === 0, `${a11y.unnamedLinks} sans nom`);
  record('A11y : champs reliés à un <label>', a11y.unlabeled === 0, `${a11y.unlabeled} non reliés`);
  record('HTML valide : pas de <button> dans <a>', a11y.nestedInteractive === 0, `${a11y.nestedInteractive} imbrications`);
  await page.getByRole('button', { name: /Captures|Screenshots/i }).first().click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const modalOpen = await page.evaluate(() => !!document.querySelector('.fixed.inset-0.z-50'));
  record('A11y : la modale se ferme avec Échap', !modalOpen);
  await ctx.close();
}

// 12. Version anglaise : contenus traduits
{
  const { ctx, page } = await newPage({}, () => localStorage.setItem('i18nextLng', 'en'));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const text = await page.evaluate(() => ['experience', 'projects', 'contact'].map(id => document.getElementById(id).innerText).join(' '));
  const french = ['En cours', 'Reconnaissance faciale', 'Suivi des tickets', 'Ouvre votre messagerie'].filter(w => text.includes(w));
  record('Version EN : expériences, projets et contact traduits', french.length === 0 && text.includes('Present'), french.join(', '));
  await page.evaluate(() => { window.location.hash = '#/etude-de-cas/data-tour-2026'; });
  await page.waitForTimeout(500);
  const cs = await page.evaluate(() => document.body.innerText);
  const csFrench = ['Retour au portfolio', 'Décisions techniques', 'Ce que j'].filter(w => cs.includes(w));
  record('Version EN : étude de cas traduite', csFrench.length === 0 && cs.includes('Key technical decisions'), csFrench.join(', '));
  await ctx.close();
}

// 13. La modale reste dans l'écran après défilement
{
  const { ctx, page } = await newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.getByRole('button', { name: /Captures|Screenshots/i }).first().click();
  await page.waitForTimeout(400);
  const box = await page.locator('[role=dialog]').boundingBox();
  record('Modale plein écran, alignée sur la fenêtre', !!box && Math.abs(box.y) < 1 && Math.abs(box.height - 900) < 2, box ? `y=${Math.round(box.y)} h=${Math.round(box.height)}` : 'absente');
  await ctx.close();
}

await browser.close();
const ok = results.filter(r => r.pass).length;
console.log(`\n${ok}/${results.length} tests réussis`);
