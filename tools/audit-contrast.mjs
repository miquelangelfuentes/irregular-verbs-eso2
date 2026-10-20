import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.AUDIT_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const problems = [];

for (const theme of ['light', 'dark']) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate((value) => {
    localStorage.setItem('eso2-portal-theme', value);
  }, theme);
  await page.reload({ waitUntil: 'networkidle' });

  const viewIds = await page.locator('.view-screen').evaluateAll((els) => els.map((el) => el.id).filter(Boolean));

  for (const viewId of viewIds) {
    await page.evaluate((id) => {
      document.querySelectorAll('.view-screen').forEach((view) => view.classList.add('hidden'));
      const target = document.getElementById(id);
      if (!target) return;
      target.classList.remove('hidden');

      // Mostra també estats alternatius que normalment apareixen després d'una interacció.
      target.querySelectorAll('.hidden').forEach((el) => {
        el.dataset.contrastAuditWasHidden = 'true';
        el.classList.remove('hidden');
      });
    }, viewId);

    const results = await new AxeBuilder({ page })
      .include(`#${viewId}`)
      .withRules(['color-contrast'])
      .analyze();

    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        problems.push({
          theme,
          viewId,
          target: node.target.join(' '),
          html: node.html.replace(/\s+/g, ' ').slice(0, 260),
          summary: node.failureSummary || violation.help,
        });
      }
    }

    await page.evaluate((id) => {
      const target = document.getElementById(id);
      target?.querySelectorAll('[data-contrast-audit-was-hidden="true"]').forEach((el) => {
        el.classList.add('hidden');
        delete el.dataset.contrastAuditWasHidden;
      });
    }, viewId);
  }
}

await browser.close();

if (problems.length) {
  console.error(`Contrast audit failed with ${problems.length} issue(s).`);
  for (const problem of problems) {
    console.error(`\n[${problem.theme}] #${problem.viewId}`);
    console.error(`Target: ${problem.target}`);
    console.error(`HTML: ${problem.html}`);
    console.error(problem.summary);
  }
  process.exit(1);
}

console.log('Contrast audit passed in light and dark mode for every Verb Quest view.');
