import { setTimeout } from "timers/promises";
import extractText from "./extract_text.mjs";
// getting variant data
const getVariantData = async (page) => {
  const variantData = [];
  const variants = await page.evaluate(() => {
    return [...document.querySelectorAll(".single-option-selector option")].map(
      (elm) => elm.value
    );
  });

  for (let variant of variants) {
    await page.select(".single-option-selector", variant);
    await setTimeout(100);
    const price = await extractText(page, "#productPrice");
    variantData.push({ variant, price });
  }
  return variantData;
};

export default getVariantData;
