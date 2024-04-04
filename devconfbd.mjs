import puppeteer from "puppeteer";
import { setTimeout } from "timers/promises";
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
await page.goto("https://devconfbd.com/");

// select element
const guestElm = await page.waitForSelector("img[alt='guest']");

// scroll to elemnt
await guestElm.scrollIntoView();
await setTimeout("1000");

// click in an element
await guestElm.click();
await setTimeout("1000");

// taking screenshot
await page.screenshot({ path: "guest.png" });

// closing browser
await browser.close();
