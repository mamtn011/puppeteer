import puppeteer from "puppeteer";
import "dotenv/config";
import proxyChain from "proxy-chain";
(async () => {
  const newProxy = await proxyChain.anonymizeProxy(process.env.USA_PROXY);

  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${newProxy}`],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto("https://edge-functions-bot-protection-datadome.vercel.app/");
  await page.screenshot({ path: "_datadome_with_proxy.png" });
  await browser.close();
  await proxyChain.closeAnonymizedProxy(newProxy);
  process.exit(0);
})();
