import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import fs from 'fs';

const LOGIN_URL = 'http://localhost:8080/login.html';

const browser = await puppeteer.launch({
    headless: true,
    args: ['--remote-debugging-port=9222'],
    defaultViewport: { width: 1280, height: 900 }
});

// 2. Automate login flow
const page = await browser.newPage();
await page.goto(LOGIN_URL, { waitUntil: 'networkidle0' });

await page.type('#username', 'demo');
await page.type('#password', 'demo123');
await Promise.all([
    page.click('#login-btn'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
]);

// 3. Confirm landed on home page (optional)
if (!(await page.url()).includes('home.html')) {
    console.error('Login did not redirect to home.html!');
    await browser.close();
    process.exit(1);
}

// 4. Run Lighthouse on the home page
const { lhr, report } = await lighthouse(page.url(), {
    port: 9222,
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
});

// 5. Save the report
fs.writeFileSync('lighthouse-home-report.html', report);

console.log(`Lighthouse Performance Score: ${lhr.categories.performance.score * 100}`);
console.log('Lighthouse report saved as lighthouse-home-report.html');

await browser.close();