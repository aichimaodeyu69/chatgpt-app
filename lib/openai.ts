import { ChatGPTUnofficialProxyAPI } from 'chatgpt'

const api = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_API_KEY!,
    apiReverseProxyUrl: process.env.OPENAI_API_URL!
})

export default api