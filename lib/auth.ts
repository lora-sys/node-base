import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import prisma from "./db";
import { sendVerificationEmail, sendResetPasswordEmail } from "./email";
import { polarClient } from "./polar";


// 环境变量验证辅助函数（仅在生产环境强制验证）
function getEnvOrWarn(name: string, requiredInProd = true): string | undefined {
  const value = process.env[name];
  const isProd = process.env.NODE_ENV === "production";

  if (!value) {
    if (requiredInProd && isProd) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    if (!isProd) {
      console.warn(
        `⚠️  Missing environment variable: ${name} (social login will be disabled)`,
      );
    }
    return undefined;
  }
  return value;
}

// 安全获取用户显示名称（避免 null/undefined）
function getDisplayName(user: {
  name?: string | null;
  email?: string | null;
}): string {
  return user.name ?? user.email ?? "there";
}

// 简单的 email mask（用于日志脱敏）
function maskEmail(email: string): string {
  if (!email) return "unknown";
  // 简单的 mask：取前2个字符 + 域名部分
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return "***";
  const userPart = email.substring(0, Math.min(2, atIndex));
  const domain = email.substring(atIndex);
  return `${userPart}***${domain}`;
}

// Compute baseURL before calling betterAuth
const baseURLDevFallback = "http://localhost:3000";
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error(
          "Missing BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL in production",
        );
      })()
    : baseURLDevFallback);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // 基础 URL 配置
  baseURL: baseURL,

  // 信任的来源（用于 CSRF 保护）
  trustedOrigins: [baseURL],

  // 邮箱密码认证
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,

    // 发送重置密码邮件
    sendResetPassword: async ({ user, url }, request) => {
      const result = await sendResetPasswordEmail({
        to: user.email,
        userName: getDisplayName(user),
        resetUrl: url,
      });

      if (!result.success) {
        const errorMsg = result.error || "Failed to send reset password email";
        console.error(errorMsg, {
          userId: user.id,
          emailHash: maskEmail(user.email),
        });
        throw new Error(errorMsg);
      }
    },

    // 密码重置成功后的回调
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password reset successfully for user`);
    },

    // Token 过期时间（1小时）
    resetPasswordTokenExpiresIn: 3600,
  },

  // 重置密码配置
  resetPassword: {
    enabled: true,
  },

  // 邮箱验证配置
  emailVerification: {
    // 发送验证邮件
    sendVerificationEmail: async ({ user, url }, request) => {
      const result = await sendVerificationEmail({
        to: user.email,
        userName: getDisplayName(user),
        verificationUrl: url,
      });

      if (!result.success) {
        const errorMsg = result.error || "Failed to send verification email";
        console.error(errorMsg, {
          userId: user.id,
          emailHash: maskEmail(user.email),
        });
        throw new Error(errorMsg);
      }
    },
    // 注册后自动发送验证邮件
    sendOnSignUp: false,
    // 验证后自动登录
    autoSignInAfterVerification: true,
    // Token 过期时间（1小时）
    expiresIn: 3600,
  },

  // OAuth 社交登录
  socialProviders: {
    ...(getEnvOrWarn("GOOGLE_CLIENT_ID", false) &&
    getEnvOrWarn("GOOGLE_CLIENT_SECRET", false)
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
        }
      : {}),
    ...(getEnvOrWarn("GITHUB_CLIENT_ID", false) &&
    getEnvOrWarn("GITHUB_CLIENT_SECRET", false)
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          },
        }
      : {}),
  },

  // Rate Limiting 配置
  rateLimit: {
    enabled: true, // 生产环境默认启用
    window: 60, // 60秒时间窗口
    max: 100, // 最多100次请求
    storage: "database", // 使用数据库存储限流数据
    modelName: "rateLimit",
    customRules: {
      // 登录接口：10秒内最多3次
      "/sign-in/email": {
        window: 10,
        max: 3,
      },
      // 注册接口：60秒内最多5次
      "/sign-up/email": {
        window: 60,
        max: 5,
      },
      // 重置密码请求：60秒内最多3次
      "/forgot-password": {
        window: 60,
        max: 3,
      },
    },
  },

  // Session 配置
  session: {
    expiresIn: 604800, // 7天
    updateAge: 86400, // 每天更新一次
  },

  // 高级配置
  advanced: {
    // IP 地址配置
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
      ipv6Subnet: 64, // IPv6 子网限流
    },
    // Cookie 配置
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  // 日志配置
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "ab021a0b-d312-4be1-ae3f-6c39a95cb274",
              slug: "pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodebase-Pro
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
		portal(),
		// usage(),
      ],
    }),
  ],
});
