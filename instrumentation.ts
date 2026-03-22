import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // ✅ 必须在 Sentry.init() 之前设置代理，让 Sentry SDK 的请求也走代理
    const proxyUrl =
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY ||
      "http://192.168.3.85:7897";

    try {
      const undici = await import("undici");
      const proxyAgent = new undici.ProxyAgent({ uri: proxyUrl });
      const originalFetch = globalThis.fetch;

      // Patch globalThis.fetch，为所有外部请求注入 dispatcher（包括 Sentry SDK）
      globalThis.fetch = ((input: any, init?: any) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
            ? input.toString()
            : input.url;

        // 本地请求不走代理
        const isLocal =
          url?.includes("localhost") ||
          url?.includes("127.0.0.1") ||
          url?.includes("::1");

        if (isLocal) {
          return originalFetch(input, init);
        }

        return originalFetch(input, {
          ...init,
          dispatcher: proxyAgent,
        } as any);
      }) as typeof fetch;

      console.log("[instrumentation] Proxy agent configured for:", proxyUrl);
    } catch (err) {
      console.error("[instrumentation] Failed to setup proxy:", err);
    }

    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
