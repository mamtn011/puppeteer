# Puppeteer

_Puppeteer is a chromium tool for web automation using javascript_

## Installation

```
nmp i puppeteer
yarn add puppeteer
```

### 1. Starting

**Import puppeteer**

```js
import puppeteer from "puppeteer";
```

**Create browser**

```js
const browser = await puppeteer.launch({
  headless: false,
  // default true (Whether the browser window open or not-work in background or not)
  defaultViewport: { width: 1920, height: 1000 },
  // default 800x600
  slowMo: 250,
  // completing every task slowly- value in milliseconds
  userDataDir: "temporary",
  /*
  in every run(when you run this file) puppeteer create a new browser profile. to prevent this we can use it. it will save temporary profile and won't create new profile from 2nd run.
  */
  // NB. there are others property for different thing. please check the documentation.
});
```

**Close browser**

```js
await browser.close();
// After completing the task, browser closing is important.
```

**Create page (browser tab)**

```js
const page = await browser.newPage();
// it will add a new tab in browser
```

**Enter in a url**

```js
await page.goto("https://example.com/", {
  waitUntil: "networkidle2",
  // wait for website network request
  timeout: 60000,
  // wait maximum 60 second. default value 30000
});
```

**Goto specific element**

```js
const guestElm = await page.waitForSelector("img[alt='guest']");
// img[alt='guest']  is a selector- an img tag with alt='guest'
```

**Scroll to selected element**

```js
await guestElm.scrollIntoView();
// here guestElm is the selected element name we select before
```

**Click on an element**

```js
await guestElm.click();
// here guestElm is the selected element name we select before
```

**Type in an input element**

```js
await inputElm.type("something you want to type");
// here inputElm is the selected element name
```

**Taking screenshot**

```js
await page.screenshot({ path: "example.com.png" });
// path will be the file name
```
