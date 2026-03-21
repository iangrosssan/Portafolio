const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 905, height: 800 });
    
    await page.goto('http://localhost:8080/repo_academico/', { waitUntil: 'load' });
    const ac = await page.evaluate(() => {
        let isVertical = window.getComputedStyle(document.querySelector('.layout')).gridTemplateColumns === 'minmax(0px, 1fr)' || 
                         window.getComputedStyle(document.querySelector('.layout')).gridTemplateColumns === '1fr' || 
                         window.getComputedStyle(document.querySelector('.layout')).gridTemplateColumns.indexOf('320') === -1;
        return {
            page: document.querySelector('.page').getBoundingClientRect().width,
            bodyW: document.body.scrollWidth,
            isVertical: isVertical
        };
    });
    
    await page.goto('http://localhost:8080/repo_codigo/', { waitUntil: 'load' });
    const co = await page.evaluate(() => {
        let isVertical = window.getComputedStyle(document.querySelector('.layout')).gridTemplateColumns === 'minmax(0px, 1fr)' || 
                         window.getComputedStyle(document.querySelector('.layout')).gridTemplateColumns === '1fr' || 
                         window.getComputedStyle(document.querySelector('.layout')).gridTemplateColumns.indexOf('320') === -1;
        return {
            page: document.querySelector('.page').getBoundingClientRect().width,
            bodyW: document.body.scrollWidth,
            isVertical: isVertical
        };
    });
    
    console.log("Academico 905:", ac);
    console.log("Codigo 905:", co);
    
    await browser.close();
})();
