import gptCompletion from "../helpers/gptCompletion.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import CONFIG from "../config/config.js";


const summariseContent = async (req, res, next) => {
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
        let combineResultsWithSource = '';
        results.map((result, index) => {
            const { pageContent, metadata } = result;
            const { url } = metadata;
            combineResultsWithSource += `Snippet[${index + 1}]:\n${pageContent}\nSource: ${url} \n\n`;
        }
        )

        const messages = [
            {
                "role": "system",
                "content": CONFIG.SYSTEM_MESSAGE
            },
            {
                "role": "user",
                "content": `Below is the context within 3 backticks:\n\`\`\`\n${combineResultsWithSource}\`\`\`\n\nAnswer the below question based on the context.\n${query}`
            }
        ];

        const payLoad = {
            messages: messages,
            model: CONFIG.MODEL,
            temperature: CONFIG.TEMPERATURE,
            max_tokens: CONFIG.MAX_TOKENS,
        }
        const completion = await gptCompletion(payLoad);
        res.send(completion.data.content);

    } catch (err) {
        next(err)
    }
}

export default summariseContent;
