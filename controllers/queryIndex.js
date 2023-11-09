import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import CONFIG from "../config/config.js";


const queryIndex = async (req, res, next) => {
    try {
        const { query = "", meta = {}, top_k = CONFIG.DEFAULT_TOP_K } = req.body;
        if (query.trim() === "") {
            return res.send("Please provide query");
        }
        const pinecone = new Pinecone();

        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings(),
            { pineconeIndex }
        );

        const results = await vectorStore.similaritySearch(query, top_k, meta);
        res.send(results);

    } catch (err) {
        next(err)
    }
}

export default queryIndex;
