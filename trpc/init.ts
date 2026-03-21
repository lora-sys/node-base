import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";

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
