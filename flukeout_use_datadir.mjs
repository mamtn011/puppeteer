import puppeteer from "puppeteer";
// import fs from "fs/promises";
import css_answers from "./css_answers.json" assert { type: "json" };
import { setTimeout } from "timers/promises";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "another",
  });
  const page = await browser.newPage();
  await page.goto("https://flukeout.github.io/");
  await page.waitForSelector(".level-header:not(.completed)");
  const currentLevel = await page.evaluate(() =>
    window.localStorage.getItem("currentLevel")
  );

  for (let [key, css_answer] of css_answers.entries()) {
    if (key < Number(currentLevel)) continue;
    {
      await page.waitForSelector(".input-strobe", { visible: true });
      await page.type(".input-strobe", css_answer, { delay: 200 });
      await page.keyboard.press("Enter");
      await page.waitForSelector(".level-header.completed");
      await page.screenshot({ path: `css_${key}.jpg` });
      await setTimeout(1000);
    }
    // const localStorageData = await page.evaluate(()=>Object.assign({}, window.localStorage));
    // await fs.writeFile("cssLocalStorageData.json", JSON.stringify(localStorageData));
  }

  await page.close();
  await browser.close();
})();
