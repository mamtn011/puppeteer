import puppeteer from "puppeteer";
import "dotenv/config";
import proxyChain from "proxy-chain";
(async () => {
  const newProxy = await proxyChain.anonymizeProxy(process.env.SPAIN_PROXY);
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1500, height: 1000 },
    userDataDir: "temporary",
    args: [`--proxy-server=${newProxy}`],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto("https://www.udemy.com/user/ali-hossain-26", {
    waitUntil: "load",
  });
  await page.waitForSelector(`[data-purpose="course-title-url"]`);
  const price = await page.$eval(
    `[data-purpose="course-title-url"]`,
    (elm) => elm.innerText
  );
  console.log({ price });
  await browser.close();
  await proxyChain.closeAnonymizedProxy(newProxy);
  process.exit(0);
})();
