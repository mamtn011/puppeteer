import puppeteer from "puppeteer";
import { setTimeout } from "timers/promises";
import "dotenv/config";
import proxyChain from "proxy-chain";
import { newInjectedPage } from "fingerprint-injector";
(async () => {
  const newProxy = await proxyChain.anonymizeProxy(process.env.ITALY_PROXY);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1500, height: 1000 },
    // userDataDir: "temporary",
    args: [`--proxy-server=${newProxy}`],
    ignoreHTTPSErrors: true,
  });
  // const page = await browser.newPage();

  // block web RTC
  const page = await newInjectedPage(browser, {
    fingerprintOptions: {
      mockWebRTC: true,
    },
  });

  await page.goto("https://proxy.incolumitas.com/proxy_detect.html");

  await setTimeout(10000);
  await page.screenshot({ path: "_is_proxy_italy_true_block_webrtc.png" });
  await browser.close();
  await proxyChain.closeAnonymizedProxy(newProxy);
  process.exit(0);
})();