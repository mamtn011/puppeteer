import puppeteer from "puppeteer";
import proxyChain from "proxy-chain";
import "dotenv/config";
import { setTimeout } from "timers/promises";
import { newInjectedPage } from "fingerprint-injector";

(async () => {
  const newProxy = await proxyChain.anonymizeProxy(process.env.USA_PROXY);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1500, height: 1000 },
    args: [`--proxy-server=${newProxy}`],
    ignoreHTTPSErrors: true,
  });

  // block web RTC
  const page = await newInjectedPage(browser, {
    fingerprintOptions: {
      mockWebRTC: true,
    },
  });
  // change time zone according to proxy server
  await page.goto("https://ifconfig.co/json");
  const ipJSON = await page.evaluate((e) => document.body.innerText);
  const timezone = JSON.parse(ipJSON)?.time_zone;
  await page.emulateTimezone(timezone);

  await page.goto("https://abrahamjuliot.github.io/creepjs/");
  await setTimeout(10000);
  await page.screenshot({
    path: "_is_proxy_creepjs.png",
    fullPage: true,
  });
  await browser.close();
  await proxyChain.closeAnonymizedProxy(newProxy);
  process.exit(0);
})();
