import "server-only";
import { createTRPCOptionsProxy, TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { createTRPCContext } from "./init";
import { getQueryClient } from "./routers/_app";
import { appRouter } from "./routers/_app";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import superjson from "superjson";

export const trpc = createTRPCOptionsProxy({
	ctx: async () =>
		createTRPCContext({
			headers: await headers(),
		}),
	router: appRouter,
	queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(async () =>
	createTRPCContext({ headers: await headers() }),
);
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient, {
      serializeData: superjson.serialize,
    })}>
      {props.children}
    </HydrationBoundary>
  );
}
 
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}