import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

// 为什么要使用全局变量？
// Next.js 的热重载（hot-reloading）会频繁重新加载模块，
// 导致创建多个 Prisma Client 实例，
// 耗尽数据库连接。将实例挂载到全局对象可避免此问题。

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
