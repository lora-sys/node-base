import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * 发送邮件
 * 
 * 使用 Resend 服务发送邮件
 * 免费层：每月 3,000 封邮件
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error("Failed to send email:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

/**
 * 发送验证邮件
 */
export async function sendVerificationEmail({
  to,
  userName,
  verificationUrl,
}: {
  to: string
  userName: string
  verificationUrl: string
}) {
  return sendEmail({
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Verify your email address</h1>
        <p>Hello ${userName},</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this email, you can safely ignore it.</p>
      </div>
    `,
    text: `Hello ${userName},\n\nPlease verify your email by visiting: ${verificationUrl}\n\nThis link will expire in 1 hour.`,
  })
}

/**
 * 发送重置密码邮件
 */
export async function sendResetPasswordEmail({
  to,
  userName,
  resetUrl,
}: {
  to: string
  userName: string
  resetUrl: string
}) {
  return sendEmail({
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Reset your password</h1>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
    text: `Hello ${userName},\n\nReset your password by visiting: ${resetUrl}\n\nThis link will expire in 1 hour.`,
  })
}
