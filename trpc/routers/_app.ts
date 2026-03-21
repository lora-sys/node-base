import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { makeQueryClient } from "../query-client";
import { cache } from "react";
import { inngest } from "@/inngest/client";
import { success } from "zod";

export const appRouter = createTRPCRouter({
	getWorkflows: protectedProcedure.query(async () => {
		return prisma.workflow.findMany({});
	}),
	createWorkflow: protectedProcedure.mutation(async () => {
		await inngest.send({
			name: "test/hello.world",
			data: {
				email: "3526039967@qq.com",
			},
		});

		return { success: true, message: "job queued" };
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const getQueryClient = cache(makeQueryClient);
