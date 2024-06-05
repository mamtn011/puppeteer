// function for collecting product links
const collectProductLinks = async (browser) => {
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
      .filter((link) => link.startsWith("https://www.studioneat.com/products/"))
  );
  await page.close();
  return productLinks;
};

export default collectProductLinks;
