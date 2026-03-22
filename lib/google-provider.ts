import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { Dispatcher } from 'undici';

// 从环境变量读取代理 URL（无硬编码默认值）
const proxyUrl =
  process.env.GOOGLE_PROXY_URL ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY;

// 验证 API key
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is required');
}

// 缓存 ProxyAgent 实例，避免每次调用都创建新连接
let cachedProxyAgent: Dispatcher | undefined;

// 创建 proxyFetch 函数（异步初始化 undici）
const proxyFetch = (async (url: string | URL | Request, init?: RequestInit & { dispatcher?: Dispatcher }): Promise<Response> => {
  // 如果配置了代理，创建或复用 ProxyAgent
  if (proxyUrl) {
    if (!cachedProxyAgent) {
      const { ProxyAgent } = await import('undici');
      cachedProxyAgent = new ProxyAgent({ uri: proxyUrl });
    }

    return fetch(url, {
      ...init,
      dispatcher: cachedProxyAgent,
    });
  }

  // 无代理配置，直接使用标准 fetch
  return fetch(url, init);
}) as typeof fetch;

// 导出配置好的 Google provider
export const google = createGoogleGenerativeAI({
  apiKey,
  fetch: proxyFetch,
});
