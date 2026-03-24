import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { customerTaxIdFromJSON } from "@polar-sh/sdk/models/components/customer.js";
import { initTRPC, TRPCError } from "@trpc/server";
import { CopyX } from "lucide-react";


export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });
  return {
    session,
    userId: session?.user?.id,
  };
};

const t = initTRPC
	.context<Awaited<ReturnType<typeof createTRPCContext>>>()
	.create({});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export { TRPCError }; // 导出 TRPCError 供其他模块使用

// 获取 session 类型
type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

// 扩展上下文类型
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  return next({
    ctx: {
      ...ctx,
      auth: ctx.session,
    } as typeof ctx & { auth: NonNullable<Session> },
  });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ctx,next}) => {
    try {
      const customer = await polarClient.customers.getStateExternal({
        externalId : ctx.auth.user.id
      });

      if (
        !customer.activeSubscriptions ||
        customer.activeSubscriptions.length === 0
      ) {
        throw new TRPCError({
          code : "FORBIDDEN",
          message : "Activate subscription required",
        });
      }

      return next({ctx : {...ctx,customer}});
    } catch (error) {
      // If it's already a TRPCError, re-throw it unchanged
      if (error instanceof TRPCError) {
        throw error;
      }

      // Handle Polar API errors with specific error codes
      const isPolarError = error && typeof error === 'object' && 'name' in error;
      
      if (isPolarError) {
        const polarError = error as { name?: string; status?: number; message?: string };
        
        // Network timeout or connection error
        if (polarError.name === 'TimeoutError' || polarError.name === 'NetworkError') {
          console.error('Polar API network error:', polarError);
          throw new TRPCError({
            code: 'SERVICE_UNAVAILABLE',
            message: 'Payment service temporarily unavailable, please try again later',
          });
        }
        
        // Rate limiting (429)
        if (polarError.status === 429) {
          console.warn('Polar API rate limited');
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests, please try again in a moment',
          });
        }
        
        // Polar API service error (5xx)
        if (polarError.status && polarError.status >= 500 && polarError.status < 600) {
          console.error('Polar API service error:', polarError);
          throw new TRPCError({
            code: 'SERVICE_UNAVAILABLE',
            message: 'Payment service temporarily unavailable, please try again later',
          });
        }
      }

      // Log unexpected errors for debugging
      console.error('Error fetching customer state:', error);

      // For other unexpected errors, return a generic error without leaking backend details
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify subscription status',
        cause: error,
      });
    }
  }
);