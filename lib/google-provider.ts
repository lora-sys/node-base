import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

// 创建代理 agent
const proxyAgent = new HttpsProxyAgent('http://192.168.3.85:7897');

// 自定义 fetch，注入代理
const proxyFetch = (url: string | URL | Request, init?: RequestInit) => {
  return fetch(url, {
    ...init,
    agent: proxyAgent,
  } as any);
};

// 导出配置好的 Google provider
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  fetch: proxyFetch,
});
