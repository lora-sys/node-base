import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

// 从环境变量读取代理 URL，允许覆盖
const proxyUrl = process.env.GOOGLE_PROXY_URL || process.env.HTTP_PROXY || process.env.HTTPS_PROXY;

// 验证 API key
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is required');
}

// 创建代理 agent（仅在配置了代理时）
let proxyFetch: typeof fetch;
if (proxyUrl) {
  const proxyAgent = new HttpsProxyAgent(proxyUrl);

  // 自定义 fetch，注入代理
  proxyFetch = (url: string | URL | Request, init?: RequestInit) => {
    return fetch(url, {
      ...init,
      agent: proxyAgent,
    });
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
