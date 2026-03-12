const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:8080');
  
  // Let animations finish
  await page.waitForTimeout(1000);

  const analysis = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    
    const overflowingElements = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.right > docWidth && 
          el.tagName !== 'SCRIPT' && 
          el.tagName !== 'STYLE' && 
          el.tagName !== 'BODY' && 
          el.tagName !== 'HTML') {
        
        overflowingElements.push({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          right: rect.right,
          width: rect.width,
          position: style.position,
          left: rect.left
        });
      }
    });

    return {
      viewportWidth: window.innerWidth,
      docWidth,
      scrollWidth,
      isOverflowing: scrollWidth > docWidth,
      elements: overflowingElements
    };
  });

  console.log(JSON.stringify(analysis, null, 2));

  await browser.close();
})();
