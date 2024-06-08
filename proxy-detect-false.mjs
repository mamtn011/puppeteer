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
    // args: [`--proxy-server=${newProxy}`],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto("https://proxy.incolumitas.com/proxy_detect.html");

  await setTimeout(10000);
  await page.screenshot({ path: "_is_proxy_false.png" });
  // await page.screenshot({ path: "_is_proxy_true.png" });
  await browser.close();
  await proxyChain.closeAnonymizedProxy(newProxy);
  process.exit(0);
})();
