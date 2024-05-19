import puppeteer from "puppeteer";
import fs from "fs/promises";
import css_answers from "./css_answers.json" assert { type: "json" };
import { setTimeout } from "timers/promises";

(async () => {
  // get saved local storage data from json file (if not available, create with null value)
  const { default: existingLocalStorageData } = await import(
    "./flukeOutLocalStorageData.json",
    {
      assert: { type: "json" },
    }
  ).catch(() => ({ default: { progress: null, currentLevel: null } }));

  // create browser, page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "temporary",
  });
  const page = await browser.newPage();

  // set existing local storage data to new page
  const pageFunction = (existingLocalStorageData) => {
    localStorage.clear();
    localStorage.setItem("progress", existingLocalStorageData.progress);
    localStorage.setItem("currentLevel", existingLocalStorageData.currentLevel);
  };
  await page.evaluateOnNewDocument(pageFunction, existingLocalStorageData);
  await page.goto("https://flukeout.github.io/");

  // iterating css_answers to fill up input and do necessary actions
  for (let [key, css_answer] of css_answers.entries()) {
    if (key < Number(existingLocalStorageData.currentLevel)) continue;
    {
      await page.waitForSelector(".level-header:not(.completed)");
      await page.waitForSelector(".input-strobe", { visible: true });
      await page.type(".input-strobe", css_answer, { delay: 200 });
      await page.keyboard.press("Enter");
      await page.waitForSelector(".level-header.completed");
      await page.screenshot({ path: `css_${key}.jpg` });
    }
    await setTimeout(1000);
    // get local storage data and save it to a json file
    const localStorageData = await page.evaluate(() =>
      Object.assign({}, window.localStorage)
    );
    await fs.writeFile(
      "flukeOutLocalStorageData.json",
      JSON.stringify(localStorageData)
    );
  }

  await browser.close();
})();
