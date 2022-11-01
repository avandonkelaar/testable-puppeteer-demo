const puppeteer = require('puppeteer');
const { expect } = require('chai');
const testableUtils = require('testable-utils');

before (async function () {
    global.browser = await puppeteer.launch();
});

describe('DuckDuckGo', () => {
    let scriptTime = 0;
  it('should open de homepage',  async () => {

    const timeout = 5000;
    const page = await browser.newPage();
    page.setDefaultTimeout(timeout);
    const start = Date.now();
    await page.goto('https://duckduckgo.com/', { waitUntil: 'networkidle2' })
    const title = await page.title();
    expect(title).to.equal('DuckDuckGo — Privacy, vereenvoudigd.');
    const duration = Date.now() - start;
    scriptTime += duration;
    testableUtils.results().timing({ name: 'home', val: duration, units: 'ms' });
    await page.screenshot({path: 'home.png'});
  });

});

after(async () => browser.close());