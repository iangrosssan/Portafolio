const puppeteer = require('puppeteer');

async function measure(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const dimensions = await page.evaluate(() => {
        function getW(selector) {
            const el = document.querySelector(selector);
            return el ? el.getBoundingClientRect().width : null;
        }
        return {
            page: getW('.page'),
            layout: getW('.layout'),
            sidebar: getW('.sidebar'),
            main: getW('main'),
            iframe: getW('iframe'),
            body: document.body.scrollWidth,
            window: window.innerWidth
        };
    });
    
    console.log(url, dimensions);
    await browser.close();
}

(async () => {
    await measure('http://localhost:8080/repo_academico/');
    await measure('http://localhost:8080/repo_codigo/');
})();
