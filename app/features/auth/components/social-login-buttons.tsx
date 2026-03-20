import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  SOCIAL_PROVIDERS,
  SOCIAL_PROVIDER_LABELS,
  SOCIAL_PROVIDER_ICONS,
  BUTTON_OUTLINE_CLASSES,
} from "../constants"

export type SocialLoginType = "login" | "register"

interface SocialLoginButtonsProps {
  type?: SocialLoginType
  onSocialLogin: (provider: typeof SOCIAL_PROVIDERS[keyof typeof SOCIAL_PROVIDERS]) => void
  disabled?: boolean
}

export function SocialLoginButtons({
  type = "login",
  onSocialLogin,
  disabled = false,
}: SocialLoginButtonsProps) {
  const getAriaLabel = (provider: typeof SOCIAL_PROVIDERS[keyof typeof SOCIAL_PROVIDERS]) => {
    const action = type === "login" ? "Sign in" : "Sign up"
    return `${action} with ${SOCIAL_PROVIDER_LABELS[provider]}`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {Object.values(SOCIAL_PROVIDERS).map((provider) => (
        <Button
          key={provider}
          variant="outline"
          className={BUTTON_OUTLINE_CLASSES}
          onClick={() => onSocialLogin(provider)}
          disabled={disabled}
          aria-label={getAriaLabel(provider)}
        >
          <Image
            src={SOCIAL_PROVIDER_ICONS[provider]}
            alt={SOCIAL_PROVIDER_LABELS[provider]}
            width={16}
            height={16}
            className="mr-2"
          />
          {SOCIAL_PROVIDER_LABELS[provider]}
        </Button>
      ))}
    </div>
  )
}