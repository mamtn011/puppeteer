// functions for collecting single product data
const extractText = async (page, selector) => {
  return await page.$eval(selector, (elm) => elm.innerText.trim());
};
export default extractText;
