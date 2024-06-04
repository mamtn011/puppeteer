import puppeteer from "puppeteer";
import { setTimeout } from "timers/promises";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

(async () => {
  const db = new Low(new JSONFile("ecommerce.json"), {});
  await db.read();
  const saveToDB = async (id, productData) => {
    db.data[id] = productData;
    await db.write();
  };

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "temporary",
    defaultViewport: { width: 1920, height: 1000 },
  });

  // function for collecting product links
  const collectProductLinks = async () => {
    const page = await browser.newPage();
    await page.goto("https://www.studioneat.com/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    const productElm = await page.waitForSelector(".product-title a");
    // await productElm.scrollIntoView();
    const productLinks = await page.$$eval(".product-title a", (elms) =>
      elms
        .map((elm) => elm.href)
        .filter((link) =>
          link.startsWith("https://www.studioneat.com/products/")
        )
    );
    await page.close();
    return productLinks;
  };

  // functions for collecting single product data
  const extractText = async (page, selector) => {
    return await page.$eval(selector, (elm) => elm.innerText.trim());
  };
  const collectProductData = async (productLink) => {
    const page = await browser.newPage();
    await page.goto(productLink, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    await page.waitForSelector(".ecomm-container h1");
    const title = await extractText(page, ".ecomm-container h1");
    const tagline = await extractText(page, ".product-tagline");
    const price = await extractText(page, "#productPrice");

    // getting variant data
    const variantData = [];
    const variants = await page.evaluate(() => {
      return [
        ...document.querySelectorAll(".single-option-selector option"),
      ].map((elm) => elm.value);
    });

    for (let variant of variants) {
      await page.select(".single-option-selector", variant);
      await setTimeout(100);
      const price = await extractText(page, "#productPrice");
      variantData.push({ variant, price });
    }

    await page.close();
    return { title, tagline, price, variantData };
  };

  // getting product data using loop
  const productLinks = await collectProductLinks();
  for (let productLink of productLinks) {
    if (db.data[productLink]) continue;
    await saveToDB(productLink, await collectProductData(productLink));
  }

  await browser.close();
})();
