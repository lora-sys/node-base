import { createGoogleGenerativeAI } from '@ai-sdk/google';

// 从环境变量读取代理 URL
const proxyUrl =
  process.env.GOOGLE_PROXY_URL ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  'http://192.168.3.85:7897';

// 验证 API key
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is required');
}

// 创建 undici ProxyAgent（仅在配置了代理时）
let proxyFetch: typeof fetch;
if (proxyUrl) {
  // 动态导入 undici 以避免 SSR 问题
  const undici = require('undici');
  const proxyAgent = new undici.ProxyAgent({ uri: proxyUrl });

  // 自定义 fetch，注入 dispatcher（不是 agent！）
  proxyFetch = async (url: string | URL | Request, init?: RequestInit) => {
    return fetch(url, {
      ...init,
      dispatcher: proxyAgent,
    } as any);
  };
} else {
  // 无代理配置，直接使用标准 fetch
  proxyFetch = fetch;
}

// 导出配置好的 Google provider
export const google = createGoogleGenerativeAI({
  apiKey,
  fetch: proxyFetch,
});
