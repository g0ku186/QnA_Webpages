import { extractFromHtml } from '@extractus/article-extractor';
import cheerio from 'cheerio';
import axios from 'axios';

const fetchContentFromHTML = async (url, tags_to_remove) => {
    try {
        const res = await axios.get(url, { timeout: 10000 });
        const html = res.data;
        const article = await extractFromHtml(html, url);
        const content = article.content;

        const $ = cheerio.load(content);

        // Remove specified HTML tags
        $('img, video, figure').remove();

        // Helper function to remove specified tags while preserving the inner content
        const removeTags = tags => {
            tags.each(function () {
                $(this).replaceWith($(this).contents());
            });
        };

        removeTags($(tags_to_remove));

        // Get the updated HTML content without extra tags
        const updatedContent = $('body').html().replace(/\t/g, '');
        return `<title>${article.title}</title>\n${updatedContent}`

    } catch (err) {
        throw err;
    }
};

export default fetchContentFromHTML;