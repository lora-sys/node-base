import { requireUnauth } from "@/lib/auth-utils"
import { ForgotPasswordForm } from "@/app/features/auth/components/forgot-password-form"
import { AuthBackground } from "@/app/features/auth/components/auth-background"

export default async function ForgotPasswordPage() {
  await requireUnauth()

  return (
    <AuthBackground>
      <ForgotPasswordForm />
    </AuthBackground>
  )
}
