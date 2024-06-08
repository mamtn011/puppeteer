import puppeteer from "puppeteer";
import { setTimeout } from "timers/promises";
import "dotenv/config";
import proxyChain from "proxy-chain";
(async () => {
  const newProxy = await proxyChain.anonymizeProxy(process.env.USA_PROXY);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1500, height: 1000 },
    userDataDir: "temporary",
    args: [`--proxy-server=${newProxy}`],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto("https://www.sephora.com");
  // await page.waitForSelector(`[data-purpose="course-title-url"]`);
  await setTimeout(5000);
  await browser.close();
  await proxyChain.closeAnonymizedProxy(newProxy);
  process.exit(0);
})();
