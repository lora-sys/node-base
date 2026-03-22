import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // 从环境变量读取代理 URL（无硬编码默认值）
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

    // 仅当配置了代理时才设置
    if (proxyUrl) {
      try {
        const undici = await import("undici");
        const proxyAgent = new undici.ProxyAgent({ uri: proxyUrl });
        const originalFetch = globalThis.fetch;

        // Patch globalThis.fetch，为所有外部请求注入 dispatcher（包括 Sentry SDK）
        globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
          let urlString: string | undefined;

          // 解析 URL
          try {
            if (typeof input === "string") {
              urlString = input;
            } else if (input instanceof URL) {
              urlString = input.toString();
            } else if (input && typeof input === "object" && "url" in input) {
              urlString = String((input as any).url);
            }
          } catch {
            urlString = undefined;
          }

          // 本地请求不走代理
          let isLocal = false;
          if (urlString) {
            try {
              const url = new URL(urlString);
              const hostname = url.hostname;
              isLocal =
                hostname === "localhost" ||
                hostname === "127.0.0.1" ||
                hostname === "::1" ||
                hostname === "0.0.0.0";
            } catch {
              // 如果 URL 解析失败，保守处理：不代理
              isLocal = false;
            }
          }

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
    }

    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
