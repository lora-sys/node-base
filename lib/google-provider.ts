import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { fetch as undiciFetch, ProxyAgent } from "undici";

// 从环境变量读取代理 URL（无硬编码默认值）
const proxyUrl =
	process.env.GOOGLE_PROXY_URL ||
	process.env.HTTPS_PROXY ||
	process.env.HTTP_PROXY;

// 验证 API key
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
	throw new Error(
		"GOOGLE_GENERATIVE_AI_API_KEY environment variable is required",
	);
}

// 缓存 ProxyAgent 实例
let proxyAgent: ProxyAgent | undefined;

// 使用 undici 的 fetch，直接注入 dispatcher
const googleFetch = async (
	url: string | URL | Request,
	init?: RequestInit,
): Promise<Response> => {
	// 如果配置了代理，初始化或复用 ProxyAgent
	if (proxyUrl && !proxyAgent) {
		proxyAgent = new ProxyAgent({ uri: proxyUrl });
	}

	// 使用 undiciFetch 并传递 dispatcher（如果存在）
	// @ts-expect-error undici fetch 接受 dispatcher 选项
	return undiciFetch(url, {
		...init,
		...(proxyAgent && { dispatcher: proxyAgent }),
	});
};

// 导出配置好的 Google provider
export const google = createGoogleGenerativeAI({
	apiKey,
	fetch: googleFetch,
});
