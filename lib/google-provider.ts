import { createGoogleGenerativeAI } from '@ai-sdk/google';

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

// 创建 proxyFetch 函数（异步初始化 undici）
const proxyFetch = (async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
  // 如果配置了代理，创建带 dispatcher 的 fetch
  if (proxyUrl) {
    const { ProxyAgent, Dispatcher } = await import('undici');
    const proxyAgent: Dispatcher = new ProxyAgent({ uri: proxyUrl });

    return fetch(url, {
      ...init,
      dispatcher: proxyAgent,
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
