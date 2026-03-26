import { Polar } from "@polar-sh/sdk";

// Validate POLAR_ACCESS_TOKEN in non-development environments
const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;
if (!polarAccessToken && process.env.NODE_ENV !== "development") {
	throw new Error(
		"POLAR_ACCESS_TOKEN is required in non-development environments. " +
			"Please set it in your environment variables.",
	);
}

export const polarClient = new Polar({
	accessToken: polarAccessToken,
	server: process.env.NODE_ENV !== "production" ? "sandbox" : "production", // Uses sandbox in dev/staging, production in production
});
