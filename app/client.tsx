"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
	const trpc = useTRPC();
	const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions());

	return <div>client components: {JSON.stringify(users)}</div>;
};
