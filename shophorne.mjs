import puppeteer from "puppeteer";
import "dotenv/config";
import proxyChain from "proxy-chain";
(async () => {
  const newProxy = await proxyChain.anonymizeProxy(process.env.ITALY_PROXY);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1500, height: 1000 },
    userDataDir: "temporary",
    args: [`--proxy-server=${newProxy}`],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto("https://shophorne.com/products/type-75-desk-lamp");
  await page.waitForSelector(`[data-ref="price"]`);
  const price = await page.$eval(`[data-ref="price"]`, (elm) => elm.innerText);
  console.log({ price });
  await browser.close();
  await proxyChain.closeAnonymizedProxy(newProxy);
  process.exit(0);
})();
