import { createTRPCRouter, protectedProcedure, TRPCError } from "../init";
import prisma from "@/lib/db";
import { makeQueryClient } from "../query-client";
import { cache } from "react";
import { inngest } from "@/inngest/client";
import * as z from "zod";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.input(
    z.object({
      limit: z.number().int().positive().max(100).optional(),
      offset: z.number().int().nonnegative().optional(),
    }),
  ).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 20;
    const offset = input.offset ?? 0;
    const userId = ctx.auth.user.id;

    return prisma.workflow.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  }),
  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    if (!userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User ID is required",
      });
    }
    await inngest.send({
      name: "test/hello.world",
      data: {
        userId,
      },
    });

    return { success: true, message: "job queued" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const getQueryClient = cache(makeQueryClient);
