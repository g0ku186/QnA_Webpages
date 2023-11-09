import fs from 'fs';
import fetchContentFromHTML from "./fetchContentFromUrl.js";

const scrapeUrls = async (urls, tagsToRemove = 'strong, i, span, em, article, iframe, a, picture, source, hr') => {
    for (let i = 0; i < urls.length; i++) {
        const data = await fetchContentFromHTML(urls[i], tagsToRemove);
        fs.writeFile(`./${i}.txt`, data, (err) => {
            if (err) throw err;
        });
    }
};

export default scrapeUrls;

