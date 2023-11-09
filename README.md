A simple RAG API for QnA based on webpages. 

Features:
1. Scrape HTML content from URLs.
2. Clean HTML - Simply define comma seperated tags that needs to be removed from HTML.
3. Split the content into chunks. Get embeddings using 'ada'.
4. Store in pinecone
5. Answer the questions with gpt-turbo-16k-1106

This comes with 3 API endpoints:
1. /api/storeDataFromUrls: Takes in an array of URLs and stores the content as embeddings. Optional parameters include: chunkSize and chunkOverlap.
2. /api/queryIndex: Takes in query, and optional meta and topk to fetch the results from vector store.
3. /api/summariseContent: takes in query, and optional meta and topk to answer the question based on context.

Someother helper functions include:
1. Deleting docs by id
2. Fetching and storing content in txt files
3. A universal GPT completion with streaming and auto-retry.

Env Variables:
OPENAI_API_KEY="sk-...."
PINECONE_API_KEY="ggwp..."
PINECONE_ENVIRONMENT="us-east1-gcp" ( Find it in pinecone dashboard)
PINECONE_INDEX="webpage-data" ( First create the index from pinecone dashboard)

Config Object:
Pretty much everything can be configured here.
const CONFIG = {
    SYSTEM_MESSAGE: "You are a helpful assistant designed to answer questions based on the given context.",
    MODEL: "gpt-3.5-turbo-1106",
    TEMPERATURE: 0,
    MAX_TOKENS: 1000,
    MAX_RETRIES: 3,
    DEFAULT_TOP_K: 10,
    DEFAULT_TAGS_TO_REMOVE: 'strong, i, span, em, article, iframe, a, picture, source, hr',
    DEFAULT_CHUNK_SIZE: 2400,
    DEFAULT_CHUNK_OVERLAP: 100,
}
