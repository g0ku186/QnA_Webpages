import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import fetchContentFromHTML from "../helpers/fetchContentFromUrl.js";
import CONFIG from "../config/config.js";

const scrapeUrl = async (url, tagsToRemove = CONFIG.DEFAULT_TAGS_TO_REMOVE) => {
    const data = await fetchContentFromHTML(url, tagsToRemove);
    return data;
};

const storeDataFromUrls = async (req, res, next) => {
    try {
        const { urls, tagsToRemove, chunkSize = CONFIG.DEFAULT_CHUNK_SIZE, chunkOverlap = CONFIG.DEFAULT_CHUNK_OVERLAP } = req.body;
        const pinecone = new Pinecone();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
        const embeddings = new OpenAIEmbeddings();
        const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });
        const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
            chunkSize,
            chunkOverlap,
        })


        for (let i = 0; i < urls.length; i++) {
            const data = await scrapeUrl(urls[i], tagsToRemove);
            const docOutput = await splitter.splitDocuments([
                new Document({ pageContent: data, metadata: { url: urls[i] } }),
            ]);
            await pineconeStore.addDocuments(docOutput);
        }

        res.send('Added docs to index');

    } catch (err) {
        next(err)
    }
}

export default storeDataFromUrls;
