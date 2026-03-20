import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./db";
import { sendVerificationEmail, sendResetPasswordEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // 基础 URL 配置
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // 信任的来源（用于 CSRF 保护）
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],

  // 邮箱密码认证
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,

    // 发送重置密码邮件
    sendResetPassword: async ({ user, url }, request) => {
      console.log("Reset password URL generated:", url);
      console.log("Reset password user:", user.email);
      void sendResetPasswordEmail({
        to: user.email,
        userName: user.name,
        resetUrl: url,
      });
    },

    // 密码重置成功后的回调
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password reset successfully for user ${user.email}`);
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
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("Verification URL generated:", url);
      console.log("Verification token:", token);
      void sendVerificationEmail({
        to: user.email,
        userName: user.name,
        verificationUrl: url,
      });
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
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
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
});
