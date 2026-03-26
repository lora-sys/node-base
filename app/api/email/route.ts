import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth";
import { headers as getHeaders } from "next/headers";
import {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "@/lib/email"

// 基础 schema
const baseSchema = z.object({
  to: z.string().email("Invalid email address"),
})

// 自定义邮件 schema
const customEmailSchema = baseSchema.extend({
  type: z.literal("custom"),
  subject: z.string().min(1).max(200),
  html: z.string(),
  text: z.string().optional(),
})

// 验证邮件 schema
const verificationEmailSchema = baseSchema.extend({
  type: z.literal("verification"),
  userName: z.string(),
  verificationUrl: z.string().url(),
})

// 重置密码邮件 schema
const resetPasswordEmailSchema = baseSchema.extend({
  type: z.literal("reset-password"),
  userName: z.string(),
  resetUrl: z.string().url(),
})

// 请求体验证 schema（使用 discriminated union）
const sendEmailSchema = z.discriminatedUnion("type", [
  customEmailSchema,
  verificationEmailSchema,
  resetPasswordEmailSchema,
])

// 速率限制（简单内存实现，生产环境应使用 Redis）
// TODO: Configure REDIS_URL environment variable to use Redis for rate limiting in production
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 分钟
const RATE_LIMIT_MAX = 5 // 每分钟最多 5 次

// 检查是否使用 Redis（生产环境）
const USE_REDIS = process.env.REDIS_URL !== undefined

function checkRateLimit(ip: string): boolean {
  const now = Date.now()

  // 只在 Map 较大时清理过期条目以避免性能问题
  if (rateLimitMap.size > 100) {
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {

    // Verify the request is authenticated
   const session = await auth.api.getSession({
      headers: await getHeaders(),
    });
    if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

    // 获取客户端 IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"

    // 速率限制检查
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const parsed = sendEmailSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    let result

    // 根据类型发送不同邮件
    switch (data.type) {
      case "verification":
        result = await sendVerificationEmail({
          to: data.to,
          userName: data.userName,
          verificationUrl: data.verificationUrl,
        })
        break
    
      case "reset-password":
        result = await sendResetPasswordEmail({
          to: data.to,
          userName: data.userName,
          resetUrl: data.resetUrl,
        })
        break
    
      case "custom":
      default:
        result = await sendEmail({
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        })
        break
    }
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
