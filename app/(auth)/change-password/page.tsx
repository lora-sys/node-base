import Link from "next/link"

import { ChangePasswordForm } from "@/app/features/auth/components/change-password-form"
import { AuthBackground } from "@/app/features/auth/components/auth-background"

export default function ChangePasswordPage() {
  return (
    <AuthBackground>
      <ChangePasswordForm />
      <p className="text-center text-sm text-muted-foreground mt-4">
        <Link
          href="/"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          ← Back to home
        </Link>
      </p>
    </AuthBackground>
  )
}
