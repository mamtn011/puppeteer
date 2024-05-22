import puppeteer from "puppeteer";
import "dotenv/config";
import { TOTP } from "totp-generator";
import { setTimeout } from "timers/promises";
(async () => {
  // create browser and new page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1520, height: 1000 },
    userDataDir: "temporary",
  });
  const page = await browser.newPage();

  // enter to the url
  await page.goto("https://clerk-next-demo-page.vercel.app/dashboard", {
    waitUntil: "networkidle0",
  });
  const identifierBox = await page.waitForSelector("#identifier-field");
  await identifierBox.type(process.env.USER_NAME);
  // const emailSubmitBtn = await page.waitForSelector(".cl-formButtonPrimary");
  // await emailSubmitBtn.click();

  const passwordBox = await page.waitForSelector("#password-filed");
  await passwordBox.type(process.env.PASSWORD);

  const passwordSubmitBtn = await page.waitForSelector(".cl-formButtonPrimary");
  await passwordSubmitBtn.click();

  const typeOtp = async () => {
    const otpBox = await page.waitForSelector(".cl-otpCodeFiledInputs");
    const { otp, expires } = TOTP.generate(process.env.TOTP_SECRET);
    await otpBox.type(otp);

    await page
      .waitForSelector(".cl-otpCodeFieldErrorText", { timeout: 3000 })
      .then(async () => {
        await setTimeout(3000);
        return typeOtp();
      })
      .catch(() => console.log("You have been logged in successfully!"));
  };

  await typeOtp();
  // take screenshot
  await page.screenshot({ path: "totp-demo.png" });

  await browser.close();
})();
