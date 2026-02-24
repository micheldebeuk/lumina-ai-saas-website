const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = path.resolve(__dirname, 'index.html');
    const url = `file://${filePath}`;

    console.log(`Navigating to: ${url}`);
    await page.goto(url);

    // Set viewport to a desktop size
    await page.setViewportSize({ width: 1440, height: 900 });

    const screenshotPath = path.resolve(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`Screenshot saved to: ${screenshotPath}`);
    await browser.close();
})();
