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

export default CONFIG;