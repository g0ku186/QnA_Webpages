# RAG API for QnA Based on Webpages

This API provides a simple retrieval-augmented generation (RAG) system for question answering (QnA) based on content from webpages.

## Features

- Scrape HTML content from given URLs.
- Clean HTML content by removing defined tags (comma-separated).
- Split the content into chunks and retrieve embeddings using the 'ada' model.
- Store embeddings in Pinecone.
- Answer questions with the gpt-turbo-16k-1106 model.

## API Endpoints

1. **/api/storeDataFromUrls**: 
   - **Description**: Stores content from an array of URLs as embeddings.
   - **Optional Parameters**: `chunkSize`, `chunkOverlap`.

2. **/api/queryIndex**: 
   - **Description**: Fetches results from the vector store based on a query.
   - **Optional Parameters**: `meta`, `topk`.

3. **/api/summariseContent**: 
   - **Description**: Answers questions based on context using a given query.
   - **Optional Parameters**: `meta`, `topk`.

## Helper Functions

- Delete documents by ID.
- Fetch and store content in TXT files.
- Universal GPT completion with streaming and auto-retry.

## Environment Variables

```env
OPENAI_API_KEY="sk-...."
PINECONE_API_KEY="ggwp..."
PINECONE_ENVIRONMENT="us-east1-gcp" # Find this in your Pinecone dashboard
PINECONE_INDEX="webpage-data" # Create the index from the Pinecone dashboard first
```
##CONFIG Obj
```
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
```
