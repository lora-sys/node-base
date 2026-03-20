import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { headers } from 'next/headers';
import { cache } from 'react';
import { createTRPCContext } from '@/trpc/init';
import { makeQueryClient } from '@/trpc/query-client';
import { appRouter } from '@/trpc/routers/_app';

export const getQueryClient = cache(makeQueryClient);

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

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/[trpc]',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  });

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
