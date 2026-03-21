import { createTRPCRouter, protectedProcedure, TRPCError } from "../init";
import prisma from "@/lib/db";
import { makeQueryClient } from "../query-client";
import { cache } from "react";
import { inngest } from "@/inngest/client";
import * as z from "zod";

// Maximum offset to prevent deep scans
const MAX_OFFSET = 1000;

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).optional(),
        cursor: z.string().optional(), // cursor is the last workflow id
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 20;
      const userId = ctx.auth?.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Use cursor-based pagination for stable, efficient queries
      const where = { userId };
      const orderBy = { createdAt: "desc" };

      const workflows = await prisma.workflow.findMany({
        where,
        orderBy,
        take: limit + 1, // Fetch one extra to determine if there's a next page
        ...(input.cursor && { cursor: { id: input.cursor } }),
      });

      // Determine if there's a next page and return only the requested amount
      const hasNext = workflows.length > limit;
      const data = hasNext ? workflows.slice(0, -1) : workflows;
      const nextCursor = hasNext ? data[data.length - 1]?.id : undefined;

      return { data, nextCursor };
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
