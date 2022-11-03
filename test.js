const puppeteer = require('puppeteer')
const { expect } = require('chai')
const testableUtils = require('testable-utils')

before(async function () {
  global.browser = await puppeteer.launch()
  global.timeout = 5000
  global.page = await browser.newPage()
  global.scriptTime = 0
  page.setDefaultTimeout(timeout)
  page.setViewport({ 'width': 1600, 'height': 1000 })
})

describe('DuckDuckGo', () => {
  it('should open de homepage', async () => {
    const start = Date.now()

    await page.goto('https://duckduckgo.com/', { waitUntil: 'networkidle2' })
    const title = await page.title()
    expect(title).to.equal('DuckDuckGo — Privacy, simplified.')

    const duration = Date.now() - start
    scriptTime += duration
    await page.screenshot({ path: './screenshots/home.png' })
    testableUtils.results().timing({ name: 'home', val: duration, units: 'ms' })
  })

  it('should show suggestions', async () => {
    const start = Date.now()
    await page.waitForSelector('input[name="q"]', { visible: true })
    await page.type('input[name="q"]', 'Puppe', { delay: 100 })

    const duration = Date.now() - start
    scriptTime += duration
    await page.screenshot({ path: './screenshots/suggestions.png' })
    testableUtils.results().timing({ name: 'suggestions', val: duration, units: 'ms' })
  })

  it('should search', async () => {
    const start = Date.now()
    await page.type('input[name="q"]', 'teer', { delay: 200 })
    const element = await waitForSelectors(['#search_button_homepage', 'button[type="submit"]'], { timeout, visible: true })
    await element.click().then(() => page.waitForNavigation({ waitUntil: 'networkidle2' }))

    const duration = Date.now() - start
    scriptTime += duration
    await page.screenshot({ path: './screenshots/searchresult.png' })
    testableUtils.results().timing({ name: 'results', val: duration, units: 'ms' })
  })

  async function waitForSelectors (selectors, options) {
    for (const selector of selectors) {
      try {
        return await page.waitForSelector(selector, options)
      } catch (err) {
        console.error(err)
      }
    }
    throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors))
  }
})

after(async () => {
  testableUtils.results().timing({ name: 'script duration', val: scriptTime, units: 'ms' })
  await page.screenshot({ path: './screenshots/after.png' })
  browser.close()
})
