import { requireUnauth } from "@/lib/auth-utils"
import { LoginForm } from "@/app/features/auth/components/login-form"
import { AuthBackground } from "@/app/features/auth/components/auth-background"

export default async function LoginPage() {
  await requireUnauth()

  return (
    <AuthBackground>
      <LoginForm />
    </AuthBackground>
  )
}
