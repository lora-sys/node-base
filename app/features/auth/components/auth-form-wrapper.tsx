import * as React from "react"
import { SocialLoginButtons, SocialLoginType } from "./social-login-buttons"

interface AuthFormWrapperProps {
  children: React.ReactNode
  showSocialLogin?: boolean
  socialLoginType?: SocialLoginType
  onSocialLogin?: (provider: "github" | "google") => void
  isPending?: boolean
}

export function AuthFormWrapper({
  children,
  showSocialLogin = true,
  socialLoginType = "login",
  onSocialLogin,
  isPending = false,
}: AuthFormWrapperProps) {
  return (
    <>
      {showSocialLogin && onSocialLogin && (
        <>
          <SocialLoginButtons
            type={socialLoginType}
            onSocialLogin={onSocialLogin}
            disabled={isPending}
          />
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        </>
      )}
      {children}
    </>
  )
}