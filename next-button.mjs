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
    "https://drou-electronics-store.myshopify.com/collections/all"
  );
};

const collectData = async () => {
  await page.waitForSelector("h2 a");
  const collectedData = await page.$$eval("h2 a", (collections) => {
    return collections.map((collection) => ({
      Title: collection.innerText.trim(),
      Link: collection.href,
    }));
  });
  console.log({ collectedData });
  return collectedData;
};

const paginate = async () => {
  const nextBtn = await page.$("li.next:not(.disabled) a");
  if (!nextBtn) return false;
  await nextBtn.evaluate((btn) => btn.click());
  return true;
};

await navigate();

while (true) {
  await collectData();
  if (!(await paginate())) break;
}

await page.close();
await browser.close();
