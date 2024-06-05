import { setTimeout } from "timers/promises";
import extractText from "../util/extract_text.mjs";
import getVariantData from "../util/get_variant_data.mjs";

const collectProductData = async (browser, productLink) => {
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
  const variantData = await getVariantData(page);

  await page.close();
  return { title, tagline, price, variantData };
};

export default collectProductData;
