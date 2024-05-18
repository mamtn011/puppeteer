import puppeteer from "puppeteer";
import fs from "fs/promises";
import xpath_answers from "./xpath-answers.json" with {type:"json"}
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "temporary",
  });
  const page = await browser.newPage();
  await page.goto("https://topswagcode.com/xpath/");

  for (let [key, xpath_answer] of xpath_answers.entries()) {
    {
      await page.waitForSelector(".level-header:not(.completed)");
      await page.waitForSelector(".input-strobe", { visible: true });
      await page.type(".input-strobe", xpath_answer, { delay: 200 });
      await page.keyboard.press("Enter");
      await page.waitForSelector(".level-header.completed");
      await page.screenshot({ path: `xpath_${key}.jpg` });
    }
    const localStorageData = await page.evaluate(()=>Object.assign({}, window.localStorage));
    await fs.writeFile("xpathLocalStorageData.json", JSON.stringify(localStorageData));
  }

  await browser.close();
})();