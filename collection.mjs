import PQueue from "p-queue";
import puppeteer from "puppeteer";
// create browser
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: { width: 1580, height: 800 },
  slowMo: 100,
  userDataDir: "temporary",
});

// create new page
const page = await browser.newPage();

// entering in a url
await page.goto("https://duckduckgo.com/", {
  waitUntil: "networkidle2",
  timeout: 60000,
});
// selecting search-input
const searchBox = await page.waitForSelector("#searchbox_input");

// type in search-input
await searchBox.type("devconfbd");

// selecting search button
const searchButton = await page.waitForSelector("button[type='submit']");

// click on the search button
await searchButton.click();

// selecting an element
const devconfLink = await page.waitForSelector(
  'a[href="https://devconfbd.com/"]'
);

// click on the selected element
await devconfLink.click();
await page.waitForSelector(".sponsors a, .supporter a");

// javascript evaluate
const sponsorLinks = await page.evaluate(() => {
  return [...document.querySelectorAll(".sponsors a")].map((elm) => elm?.href);
});
const supporterLinks = await page.evaluate(() => {
  return [...document.querySelectorAll(".supporter a")].map((elm) => elm?.href);
});
// console.log({ sponsorLinks, supporterLinks });

const getData = async (link) => {
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: "networkidle2", timeout: 60000 });
  const title = await page.title();
  const hostName = await page.evaluate(() => window.location.hostname);
  const fbLink = await page.evaluate(
    () => document.querySelector("a[href*=facebook]")?.href
  );
  const xLink = await page.evaluate(
    () => document.querySelector("a[href*=twitter]")?.href
  );
  const linkedInLink = await page.evaluate(
    () => document.querySelector("a[href*=linkedin]")?.href
  );
  console.log({ link, title, hostName, fbLink, xLink, linkedInLink });
  await page.close();
};

// // normal evaluation
// for (let link of sponsorLinks) {
//   await getData(link);
// }

// evaluate using p-queue
const queue = new PQueue({ concurrency: 2 });
for (let link of sponsorLinks) {
  queue.add(() => getData(link)).catch(console.log);
}
await queue.onEmpty();

// closing browser
await browser.close();
