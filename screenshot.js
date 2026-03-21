const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Desktop layout
    await page.setViewport({ width: 1200, height: 800 });
    
    await page.goto('http://localhost:8080/repo_academico/');
    await page.screenshot({ path: 'academico_desktop.png' });
    
    await page.goto('http://localhost:8080/repo_codigo/');
    await page.screenshot({ path: 'codigo_desktop.png' });
    
    // Mobile layout
    await page.setViewport({ width: 400, height: 800 });
    
    await page.goto('http://localhost:8080/repo_academico/');
    await page.screenshot({ path: 'academico_mobile.png' });
    
    await page.goto('http://localhost:8080/repo_codigo/');
    await page.screenshot({ path: 'codigo_mobile.png' });
    
    await browser.close();
})();
