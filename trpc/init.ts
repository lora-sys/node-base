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

export const premiumProcudure = protectedProcedure.use(
  async ({ctx,next}) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId : ctx.auth.user.id
    })
    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      throw new TRPCError({
        code : "FORBIDDEN",
        message : "Activate subscription required",
      })
    }

   return next({ctx : {...ctx,customer}});


  }
)