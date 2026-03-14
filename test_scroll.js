const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:8080');
  
  await page.waitForTimeout(1000);

  // Take a screenshot before
  await page.screenshot({ path: 'before_scroll.png' });

  // Force scroll right
  await page.evaluate(() => {
    window.scrollTo(300, 0); // scroll 300px to the right
  });
  
  await page.waitForTimeout(500);
  
  // Take a screenshot after scrolling
  await page.screenshot({ path: 'after_scroll.png' });

  const scrollX = await page.evaluate(() => window.scrollX);
  
  console.log(`ScrollX after attempt: ${scrollX}`);
  
  if (scrollX > 0) {
      console.log('Page IS horizontally scrollable.');
      
      const offenders = await page.evaluate(() => {
          let els = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            // In a scrolled state, an element that caused the scroll would have its original right edge > 390
            // but we can also just look for things rendered offscreen
            if (rect.right > 390 && el.tagName !== 'HTML' && el.tagName !== 'BODY' && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
                els.push({tag: el.tagName, class: el.className, id: el.id, right: rect.right, width: rect.width});
            }
          });
          return els;
      });
      console.log('Elements potentially causing overflow (right edge > 390px relative to viewport):', offenders);
  } else {
      console.log('Page is NOT horizontally scrollable by window.scrollTo.');
  }

  await browser.close();
})();
