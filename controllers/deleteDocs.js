import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const deleteDocs = async (req, res, next) => {
    try {
        const { ids } = req.body;
        const pinecone = new Pinecone();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
        const embeddings = new OpenAIEmbeddings();
        const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });
        await pineconeStore.delete({ ids });
        res.send("Successfully deleted docs");

    } catch (err) {
        next(err)
    }
}

export default deleteDocs;