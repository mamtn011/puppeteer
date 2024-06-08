import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1520, height: 1000 },
  slowMo: 50,
  userDataDir: "temporary",
});

const page = await browser.newPage();

const navigate = async () => {
  await page.goto(
    "https://rt-barberry.myshopify.com/collections/all?type=hidden-sidebar&view=grid-4"
  );
};

const collectData = async () => {
  await page.waitForSelector(".product__link:not([collected])");
  const collectedData = await page.$$eval(
    ".product__link:not([collected])",
    (collections) => {
      return collections.map((collection) => {
        collection.setAttribute("collected", true);
        return {
          Title: collection.getAttribute("title"),
          Link: collection.href,
        };
      });
    }
  );
  console.log({ collectedData });
  return collectedData;
};

const paginate = async () => {
  const nextBtn = await page.$(".loadmore:not(.disabled)");
  if (!nextBtn) return false;
  await nextBtn.click();
  // await page.waitForNetworkIdle()
  // await nextBtn.evaluate((btn) => btn.click());
  return true;
};

await navigate();

while (true) {
  await collectData();
  if (!(await paginate())) break;
}

await page.close();
await browser.close();
