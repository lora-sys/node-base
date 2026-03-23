import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import { polarClient } from "@polar-sh/better-auth/client"; 
import { organizationClient } from "better-auth/client/plugins"; 
export const authClient = createAuthClient({
	// 全局错误处理
	fetchOptions: {
		onError: async (context) => {
			const { response } = context;

			// 处理 Rate Limit 错误
			if (response.status === 429) {
				const retryAfter = response.headers.get("X-Retry-After");
				const message = retryAfter
					? `Too many requests. Please wait ${retryAfter} seconds before trying again.`
					: "Too many requests. Please wait a moment before trying again.";
				toast.error(message);
				return;
			}

			// 其他错误由各自的请求处理
		},
	},
	plugins : [polarClient()],
});
