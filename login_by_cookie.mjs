import puppeteer from "puppeteer";
import fs from "fs/promises";
import { setTimeout } from "timers/promises";
import js_ninja_cookie from "./js_ninja.json" assert { type: "json" };
import discovery_cookie from "./discovery_net_cookie.json" assert { type: "json" };

(async () => {
  // create browser, page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "temporary",
  });
  const page = await browser.newPage();
  // set logged in related cookie in new page
  await page.setCookie(...js_ninja_cookie);
  await page.goto("https://jsninja.live/", { waitUntil: "load" });
  const dashboardLink = await page.waitForSelector('a[href="/dashboard"]');
  await dashboardLink.click();
  await page.waitForSelector(".dashboard__section__title");
  await setTimeout(5000);

  // const page = await browser.newPage();
  // // set logged in related cookie in new page
  // await page.setCookie(...discovery_cookie);
  // await page.goto("https://care.discoverynetbd.com/", { waitUntil: "load" });
  // await setTimeout(5000);
  await page.close();
  await browser.close();
})();
