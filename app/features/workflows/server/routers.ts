import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import {
	createTRPCRouter,
	protectedProcedure,
	premiumProcedure,
} from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { Prisma } from "@/lib/generated/prisma/client";
import { TRPCBuilder } from "@trpc/server";

export const workflowsRouter = createTRPCRouter({
	create: premiumProcedure.mutation(({ ctx }) => {
		return prisma.workflow.create({
			data: {
				name: generateSlug(3),
				userId: ctx.auth.user.id,
			},
		});
	}),
	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => {
			return prisma.workflow.delete({
				where: {
					id: input.id,
					userId: ctx.auth.user.id,
				},
			});
		}),
	updateName: protectedProcedure
		.input(z.object({ id: z.string(), name: z.string().min(1) }))
		.mutation(({ ctx, input }) => {
			return prisma.workflow.update({
				where: { id: input.id, userId: ctx.auth.user.id },
				data: {
					name: input.name,
				},
			});
		}),
	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			return prisma.workflow.findUniqueOrThrow({
				where: {
					id: input.id,
					userId: ctx.auth.user.id,
				},
			});
		}),
	getMany: protectedProcedure
		.input(
			z.object({
				page: z.number().default(PAGINATION.DEFAULT_PAGE),
				pageSize: z
					.number()
					.min(PAGINATION.MIN_PAGE_SIZE)
					.max(PAGINATION.MAX_PAGE_SIZE)
					.default(PAGINATION.DEFAULT_PAGE_SIZE),
				search: z.string().default(""),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { page, pageSize, search } = input;

			const baseWhere: Prisma.WorkflowWhereInput = {
				userId: ctx.auth.user.id,
				...(search && {
					name: {
						contains: search,
						mode: Prisma.QueryMode.insensitive,
					},
				}),
			};

			const [items, totalCount] = await Promise.all([
				prisma.workflow.findMany({
					skip: (page - 1) * pageSize,
					take: pageSize,
					where: baseWhere,
					orderBy: {
						updatedAt: "desc",
					},
				}),
				prisma.workflow.count({
					where: baseWhere,
				}),
			]);

			const totalPages = Math.ceil(totalCount / pageSize);
			const hasNextPage = page < totalPages;
			const hasPreviousPage = page > 1;

			return {
				items,
				page,
				pageSize,
				totalCount,
				hasNextPage,
				hasPreviousPage,
			};
		}),
});
