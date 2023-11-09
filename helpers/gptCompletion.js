import axios from 'axios';
const chatGptEndPoint = 'https://api.openai.com/v1/chat/completions';
import CONFIG from '../config/config.js';

const gptCompletion = async (payload) => {
    const openAIHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    // Function to create a CancelToken
    const getCancelToken = () => {
        const { CancelToken } = axios;
        let cancel;
        const token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return { token, cancel };
    };

    // Function to make the API call with a timeout
    const callWithTimeout = async (cancelToken) => {
        setTimeout(() => {
            cancelToken.cancel(`Request cancelled due to timeout.`);
        }, 10000);

        return axios.post(chatGptEndPoint, payload, {
            headers: openAIHeaders,
            responseType: payload.stream ? 'stream' : 'json',
            cancelToken: cancelToken.token,
        });
    };

    // Retry loop
    let response;
    const MAX_RETRIES = CONFIG.MAX_RETRIES;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const cancelToken = getCancelToken();
        try {
            response = await callWithTimeout(cancelToken);
            // If response is successful, exit the loop
            if (response.status === 200) {
                break;
            } else {
                console.log(`Attempt ${attempt}: Received status ${response.status}, retrying...`);
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(`Attempt ${attempt}: ${err.message}`);
            } else {
                console.log('OpenAI error:', err.message);
                if (attempt === MAX_RETRIES) {
                    throw err;
                }
            }
        }
    }

    if (!response) {
        throw new Error('LLM request failed after 3 retries.');
    }
    if (payload.stream) {
        return response;
    } else {
        return {
            data: response.data.choices[0].message,
            usage: response.data.usage,
        };
    }
};

export default gptCompletion;