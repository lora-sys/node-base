import { createTRPCRouter, protectedProcedure, TRPCError } from "../init";
import prisma from "@/lib/db";
import { makeQueryClient } from "../query-client";
import { cache } from "react";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(async () => {
    return prisma.workflow.findMany({});
  }),
  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    const email = ctx.auth.user.email;
    if (!email || typeof email !== "string") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User email is required",
      });
    }
    await inngest.send({
      name: "test/hello.world",
      data: {
        email,
      },
    });

    return { success: true, message: "job queued" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const getQueryClient = cache(makeQueryClient);
