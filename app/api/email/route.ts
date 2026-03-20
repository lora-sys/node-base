import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "@/lib/email"

// 请求体验证 schema
const sendEmailSchema = z.object({
  type: z.enum(["custom", "verification", "reset-password"]).default("custom"),
  to: z.string().email("Invalid email address"),
  subject: z.string().min(1).max(200).optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  // 验证邮件专用
  userName: z.string().optional(),
  verificationUrl: z.string().url().optional(),
  // 重置密码邮件专用
  resetUrl: z.string().url().optional(),
})

// 速率限制（简单内存实现，生产环境应使用 Redis）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 分钟
const RATE_LIMIT_MAX = 5 // 每分钟最多 5 次

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
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
        if (!data.userName || !data.verificationUrl) {
          return NextResponse.json(
            { error: "Missing userName or verificationUrl for verification email" },
            { status: 400 }
          )
        }
        result = await sendVerificationEmail({
          to: data.to,
          userName: data.userName,
          verificationUrl: data.verificationUrl,
        })
        break

      case "reset-password":
        if (!data.userName || !data.resetUrl) {
          return NextResponse.json(
            { error: "Missing userName or resetUrl for reset password email" },
            { status: 400 }
          )
        }
        result = await sendResetPasswordEmail({
          to: data.to,
          userName: data.userName,
          resetUrl: data.resetUrl,
        })
        break

      case "custom":
      default:
        if (!data.subject || !data.html) {
          return NextResponse.json(
            { error: "Missing subject or html for custom email" },
            { status: 400 }
          )
        }
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
