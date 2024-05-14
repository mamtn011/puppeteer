import {JSDOM} from "jsdom";
import fs from "fs/promises";

const htmlContent = await fs.readFile("portable-bluetooth-speaker-with-fetch.html", "utf8");
const dom = new JSDOM(htmlContent);

const {document} = dom.window;

const price = document.querySelector(".product-single__bottom > p > span > span > span").textContent.trim();

console.log({price})