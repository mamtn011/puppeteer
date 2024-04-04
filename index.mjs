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
await page.goto("https://example.com/", {
  waitUntil: "networkidle2",
  timeout: 60000,
});

// taking screenshot with file name "example.com.png"
await page.screenshot({ path: "example.com.png" });

// closing browser
await browser.close();
