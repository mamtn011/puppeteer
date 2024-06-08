import puppeteer from "puppeteer";
import cookiesData from "./cookiesData.json" assert { type: "json" };

(async () => {
  // create browser and new page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "temporary",
  });
  const page = await browser.newPage();

  // set logged in related cookie in new page
  await page.setCookie(...cookiesData);

  // enter to the url
  await page.goto("https://nuxt3-realworld-example-app.vercel.app/", {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector('a[href^="/article/"]');

  // get article titles
  const articles = await page.$$eval(
    'a[href^="/article/"] h1',
    (articleTitles) => articleTitles.map((title) => title.innerText)
  );

  // take screenshot
  await page.screenshot({ path: "nuxt3-lang.png" });

  console.log({ articles });

  await browser.close();
})();
//ferkufadra@gufum.comvrtjpks3
