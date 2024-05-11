import puppeteer from "puppeteer";
// create browser
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1920, height: 1000 },
  slowMo: 100,
  userDataDir: "temporary",
});

// create new page
const page = await browser.newPage();

// entering in a url
await page.goto("https://www.studioneat.com/products/marktwo", {
  waitUntil: "networkidle2",
});
// select element
await page.waitForSelector("#productPrice");

const price = await page.evaluate(
  () => document.querySelector("#productPrice").innerText
);

console.log(price);

await browser.close();
