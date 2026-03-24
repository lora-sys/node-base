import { createTRPCRouter } from "../init";
import { makeQueryClient } from "../query-client";
import { cache } from "react";

import { workflowsRouter } from "@/app/features/workflows/server/routers";


export const appRouter = createTRPCRouter({
workflows : workflowsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const getQueryClient = cache(makeQueryClient);
