// lib/proxy-fetch.ts
import { HttpsProxyAgent } from 'https-proxy-agent';

const proxyAgent = new HttpsProxyAgent('http://192.168.3.85:7897');

export function createProxyFetch(customTimeout = 60000) {
  return async (url: string, options?: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), customTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        // @ts-ignore - undici 支持 agent 选项
        agent: proxyAgent,
        // 或者使用 keepalive 减少连接开销
        keepalive: true,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  };
}
