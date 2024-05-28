import puppeteer from "puppeteer";
import { setTimeout } from "timers/promises";
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1520, height: 1000 },
  slowMo: 50,
  userDataDir: "temporary",
});

const page = await browser.newPage();

const navigate = async () => {
  await page.goto("https://apps.shopify.com/infinite-scroll-pro-1");
  await page.click('a[href*="demo"]');
  await page.waitForNetworkIdle();

  await page.goto(
    "https://infinity-scroll-pro-demo.myshopify.com/collections/foodie"
  );
  await page.bringToFront();
  await page.waitForSelector(".grid__item");
};

const collectData = async () => {
  const productElm = await page.$(".grid__item");
  if (!productElm) return false;
  await productElm.scrollIntoView();

  // collect product data
  const collectedData = await productElm.evaluate((product) => {
    const productData = {
      title: product.querySelector("a").innerText.trim(),
      link: product.querySelector("a").href,
    };
    return productData;
  });
  // remove product whose data was collected already.
  await productElm.evaluate((product) => product.remove());

  return collectedData;
};

await navigate();
let collectedInfo;
while ((collectedInfo = await collectData())) {
  await setTimeout(200);
  if (!collectedInfo) break;
  console.log({ collectedInfo });
}

await page.close();
await browser.close();
