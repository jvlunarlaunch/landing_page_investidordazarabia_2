const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:8080');

  const overflowingElements = await page.evaluate(() => {
    const docWidth = 390;
    const overflow = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
        overflow.push({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          right: rect.right
        });
      }
    });
    return overflow;
  });

  console.log('Overflowing elements:');
  console.log(overflowingElements);

  await browser.close();
})();
