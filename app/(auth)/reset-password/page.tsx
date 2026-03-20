"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

import { ResetPasswordForm } from "@/app/features/auth/components/reset-password-form"
import { AuthBackground } from "@/app/features/auth/components/auth-background"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await authClient.getSession({
          fetchOptions: {
            credentials: "include",
          },
        })
        if (session) {
          router.push("/")
        }
      } catch (error) {
        // 未登录，继续显示页面
      } finally {
        setIsChecking(false)
      }
    }

    checkSession()
  }, [router])

  if (isChecking) {
    return (
      <AuthBackground>
        <div className="flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </AuthBackground>
    )
  }

  return (
    <AuthBackground>
      <ResetPasswordForm token={token} error={error} />
      <div className="flex gap-4 text-sm text-muted-foreground mt-4">
        <Link
          href="/forgot-password"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Request new link
        </Link>
        <span>•</span>
        <Link
          href="/login"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthBackground>
  )
}
