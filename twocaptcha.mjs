import puppeteer from "puppeteer";
import path from "path";

// add capsolver extension then download and extract it and then keep the folder in project folder
const pathToExtension = path.join(process.cwd(), "twocaptcha-extension");

const browser = await puppeteer.launch({
  headless: false,
  args: [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
  ],
});
const page = await browser.newPage();
await page.goto("https://example.com");
await page.bringToFront();

const extBackgroundTarget = await browser.waitForTarget(
  (target) => target.type() === "service_worker"
);

const extensionWorker = await extBackgroundTarget.worker();

await extensionWorker.evaluate(async () => {
  const existingConfig = await chrome.storage.local.get();
  const newConfig = {
    ...existingConfig.config,
    ...{
      // collected properties with api key from 2captcha extension>inspect>chrome.storage.local.get()>config
    },
  };

  await chrome.storage.local.set({ config: newConfig });
});

const optionsPageUrl = await extBackgroundTarget
  .url()
  .replace("service_worker.js", "options/options.html");
const optionsPage = await browser.newPage();
await optionsPage.goto(optionsPageUrl, { waitUntil: "networkidle0" });
const loginBtn = await page.waitForSelector('[data-lang="login"]');
await loginBtn.click();

await page.goto("https://www.google.com/recaptcha/api2/demo");
await page.waitForFunction(
  () => {
    return document
      .querySelector(".captcha-solver-info")
      ?.innerText?.includes("solved");
  },
  { timeout: 90000 }
);

console.log("Continue!");
