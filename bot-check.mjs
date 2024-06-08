import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1500, height: 1000 },
  });
  const page = await browser.newPage();
  //set custom user agent
  const iphoneUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1";
  await page.setUserAgent(iphoneUA);

  await page.goto("https://bot.sannysoft.com");
  await page.screenshot({
    path: "_bot_check_custom_ua.png",
    fullPage: true,
  });
  await browser.close();
})();
