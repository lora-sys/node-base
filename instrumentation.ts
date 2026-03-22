import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // 从环境变量读取代理 URL（无硬编码默认值）
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

    // 仅当配置了代理时才设置
    if (proxyUrl) {
      try {
        // 使用 undici 包（需要 npm install undici）
        const { setGlobalDispatcher, ProxyAgent } = await import('undici');
        const proxyAgent = new ProxyAgent({ uri: proxyUrl });

        // 设置全局 dispatcher，这样所有 undici 请求（包括 Sentry SDK）都会走代理
        setGlobalDispatcher(proxyAgent);

        // 安全日志：只打印代理主机名:端口
        try {
          const proxyURL = new URL(proxyUrl);
          console.log("[instrumentation] Global undici dispatcher set to:", `${proxyURL.hostname}:${proxyURL.port}`);
        } catch {
          console.log("[instrumentation] Global undici dispatcher set");
        }
      } catch (err) {
        console.error("[instrumentation] Failed to setup proxy:", err);
      }
    }

    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
