const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Viewport for high-end feel
    await page.setViewportSize({ width: 1440, height: 900 });

    const filePath = path.resolve(__dirname, 'index.html');
    const url = `file://${filePath}`;

    await page.goto(url);

    // Wait for animations
    await page.waitForTimeout(1000);

    const screenshotPath = path.resolve(__dirname, 'lumina_final_delivery.webp');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log('Screenshot saved to:', screenshotPath);
    await browser.close();
})();
