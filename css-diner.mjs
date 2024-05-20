import puppeteer from "puppeteer";
import fs from "fs/promises";
import css_answers from "./css_answers.json" with {type:"json"}
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "temporary",
  });
  const page = await browser.newPage();
  await page.goto("https://flukeout.github.io/");

  for (let [key, css_answer] of css_answers.entries()) {
    {
      await page.waitForSelector(".level-header:not(.completed)");
      await page.waitForSelector(".input-strobe", { visible: true });
      await page.type(".input-strobe", css_answer, { delay: 200 });
      await page.keyboard.press("Enter");
      await page.waitForSelector(".level-header.completed");
      await page.screenshot({ path: `css_${key}.jpg` });
    }
    const localStorageData = await page.evaluate(()=>Object.assign({}, window.localStorage));
    await fs.writeFile("cssLocalStorageData.json", JSON.stringify(localStorageData));
  }

  await browser.close();
})();
