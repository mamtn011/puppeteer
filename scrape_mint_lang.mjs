import puppeteer from "puppeteer";
import localStorageData from "./localStorageData.json" assert { type: "json" };

(async () => {
  // create browser and new page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "temporary",
  });
  const page = await browser.newPage();

  // set local storage data to new page
  const pageFunction = (localStorageData) => {
    localStorage.setItem("user", localStorageData.user);
  };
  await page.evaluateOnNewDocument(pageFunction, localStorageData);

  // enter to the url
  await page.goto("https://realworld.mint-lang.com/", {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector('a[href^="/article/"]');

  // get article titles
  const articles = await page.$$eval(
    'a[href^="/article/"] > div:first-child',
    (articleTitles) => articleTitles.map((title) => title.innerText)
  );

  // take screenshot
  await page.screenshot({ path: "mint-lang.png" });

  console.log({ articles });

  await browser.close();
})();
