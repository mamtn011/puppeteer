import puppeteer from "puppeteer";
// creating browser
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1920, height: 1000 },
  slowMo: 250,
  userDataDir: "temporary",
});

// creating page (browser tab)
const page = await browser.newPage();

// entering in a url
await page.goto("https://duckduckgo.com/", {
  waitUntil: "networkidle2",
});

// selecting search-input
const searchBox = await page.waitForSelector("#searchbox_input");

// type in search-input
await searchBox.type("mamtn011");

// selecting search button
const searchButton = await page.waitForSelector("button[type='submit']");

// click on the search button
await searchButton.click();

// selecting an element
const myGithubLink = await page.waitForSelector(
  'a[href="https://github.com/mamtn011/"]'
);

// clicking on the link
await myGithubLink.click();

// selecting an element
await page.waitForSelector(".vcard-names ");
// taking screenshot
await page.screenshot({ path: "github_mamtn011.png" });

// closing browser
await browser.close();
