import puppeteer from "puppeteer";
import fs from "fs/promises";

const htmlContent = await fs.readFile("portable-bluetooth-speaker-with-fetch.html", "utf8");

const browser = await puppeteer.launch({
    userDataDir: "temporary",
  });

const page = await browser.newPage();

await page.setContent(htmlContent);

const price = await page.evaluate(()=>document.querySelector(".product-single__bottom > p > span > span > span").textContent.trim());

console.log({price});

await browser.close();