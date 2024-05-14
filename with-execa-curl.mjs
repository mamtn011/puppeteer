import fs from "fs/promises";
import {$} from "execa";

const fetchUrl = "https://rt-barberry.myshopify.com/collections/all/products/portable-bluetooth-speaker";
const fileName = "portable-bluetooth-speaker-with-curl-execa.html";

const isFileExist = await fs.access(fileName).then(() => true).catch(() => false);

!isFileExist && await $`curl ${fetchUrl} -o ${fileName}`;