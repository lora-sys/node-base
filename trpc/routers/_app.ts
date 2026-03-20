import { z } from 'zod';
import {createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { makeQueryClient } from '../query-client';
import { cache } from 'react';

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .query(({ ctx }) => {
      return prisma.user.findMany({
        where: {
          id: ctx.auth.user.id,
        }
      });
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const getQueryClient = cache(makeQueryClient)