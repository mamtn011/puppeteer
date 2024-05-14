import fs from "fs/promises";

const fetchUrl = "https://rt-barberry.myshopify.com/collections/all/products/portable-bluetooth-speaker";
const fileName = "portable-bluetooth-speaker-with-fetch.html";


const isFileExist = await fs.access(fileName).then(() => true).catch(() => false);

if(!isFileExist){
    const sourceCode = await fetch(fetchUrl).then(data=>data.text());
    await fs.writeFile(fileName, sourceCode);
}
