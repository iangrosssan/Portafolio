const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 800 });
    
    await page.goto('http://localhost:8080/repo_academico/', { waitUntil: 'load' });
    const ac = await page.evaluate(() => {
        return {
            page: document.querySelector('.page').getBoundingClientRect().width,
            main: document.querySelector('main').getBoundingClientRect().width,
            iframe: document.querySelector('iframe').getBoundingClientRect().width,
            body: document.body.scrollWidth
        };
    });
    
    await page.goto('http://localhost:8080/repo_codigo/', { waitUntil: 'load' });
    const co = await page.evaluate(() => {
        return {
            page: document.querySelector('.page').getBoundingClientRect().width,
            main: document.querySelector('main').getBoundingClientRect().width,
            iframe: document.querySelector('iframe').getBoundingClientRect().width,
            body: document.body.scrollWidth
        };
    });
    
    console.log("Academico 800:", ac);
    console.log("Codigo 800:", co);
    
    await browser.close();
})();
