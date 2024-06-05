import puppeteer from "puppeteer";
import saveToJson from "./lib/save_to_json.mjs";
import collectProductLinks from "./lib/collect_links.mjs";
import collectProductData from "./lib/collect_data.mjs";
import { Queue, Worker } from "bullmq";
import connection from "./util/redis_connection.mjs";
(async () => {
  const { db, saveToDB } = await saveToJson();
  // create browser
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "temporary",
    defaultViewport: { width: 1920, height: 1000 },
    // slowMo: 50,
  });

  // collecting product links
  const productLinks = await collectProductLinks(browser);

  // getting product data using bullmq
  new Worker(
    "product",
    async (job) => {
      console.log(job.data.url);
      const productLink = job.data.url;
      const collectedData = await collectProductData(browser, productLink);
      await saveToDB(productLink, collectedData);
    },
    { connection, concurrency: 2 }
  );

  const myQueue = new Queue("product", { connection });
  for (let productLink of productLinks) {
    myQueue.add(
      productLink,
      { url: productLink },
      { jobId: `${productLink}new4` }
    );
  }

  // await browser.close();
})();
