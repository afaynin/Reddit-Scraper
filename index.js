const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.reddit.com/r/AskReddit/');
 
  let allLinks = [];
  let linksAmount = 0;

  async function scrapeLinks() {
    const links = await page.evaluate(() => {
      const anchors = document.querySelectorAll('a[slot="full-post-link"]'); // Select all <a> tags on the page
      return Array.from(anchors, anchor => anchor.href);
  
    });

    allLinks = allLinks.concat(links);
    linksAmount = allLinks.length;
  }

  // Scroll down the page and scrape links until there are no more links to scrape
  let previousHeight;
 
  while (true) {
    
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForTimeout(1000); // Wait for some time for the content to load, adjust as needed
    await scrapeLinks();

    const newHeight = await page.evaluate('document.body.scrollHeight');
    console.log(linksAmount);
    if (newHeight === previousHeight || linksAmount >= 30) {
      // If the page did not scroll further, or exceeded repetitions, break the loop
      break;
    }
  }

  // Print or process all collected links
  console.log(allLinks);

  await browser.close();
})();