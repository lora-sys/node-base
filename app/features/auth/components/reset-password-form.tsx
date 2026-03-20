"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Loader2, Lock, CheckCircle2, RefreshCw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordStrengthIndicator } from "@/components/ui/password-strength"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { AuthCard } from "./auth-card"
import { AuthFormWrapper } from "./auth-form-wrapper"
import {
  FORM_MESSAGES,
  INPUT_CLASSES,
  BUTTON_PRIMARY_CLASSES,
} from "../constants"

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, FORM_MESSAGES.PASSWORD_REQUIRED)
      .min(8, FORM_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(1, FORM_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: FORM_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

interface ResetPasswordFormProps {
  token: string | null
  error: string | null
  onInvalidToken?: () => void
}

export function ResetPasswordForm({ token, error, onInvalidToken }: ResetPasswordFormProps) {
  const router = useRouter()

  const invalidCallbackRef = React.useRef(onInvalidToken)
  invalidCallbackRef.current = onInvalidToken

  const [tokenStatus, setTokenStatus] = React.useState<"checking" | "valid" | "invalid">(
    error ? "invalid" : token ? "valid" : "checking"
  )

  React.useEffect(() => {
    const newStatus = error ? "invalid" : token ? "valid" : "invalid"
    if (newStatus !== tokenStatus) {
      setTokenStatus(newStatus)
      if (newStatus === "invalid") {
        invalidCallbackRef.current?.()
      }
    }
  }, [token, error, tokenStatus])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const isPending = form.formState.isSubmitting
  const password = form.watch("password")

  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error(FORM_MESSAGES.INVALID_TOKEN)
      setTokenStatus("invalid")
      onInvalidToken?.()
      return
    }

    await authClient.resetPassword(
      {
        newPassword: data.password,
        token,
      },
      {
        onSuccess: () => {
          toast.success(FORM_MESSAGES.RESET_PASSWORD_SUCCESS)
          router.push("/")
        },
        onError: (ctx) => {
          const errorMsg = ctx.error.message?.toLowerCase() || ""
          if (errorMsg.includes("expired") || errorMsg.includes("invalid")) {
            setTokenStatus("invalid")
            onInvalidToken?.()
            toast.error(FORM_MESSAGES.TOKEN_EXPIRED)
          } else {
            toast.error(ctx.error.message)
          }
        },
      }
    )
  }

  if (tokenStatus === "checking") {
    return (
      <AuthCard
        title={FORM_MESSAGES.RESET_PASSWORD_TITLE}
        description={FORM_MESSAGES.RESET_PASSWORD_DESCRIPTION}
        footer={
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">Validating reset token...</div>
        </div>
      </AuthCard>
    )
  }

  if (tokenStatus === "invalid") {
    return (
      <AuthCard
        title={FORM_MESSAGES.INVALID_LINK}
        description={FORM_MESSAGES.INVALID_LINK_DESCRIPTION}
        footer={
          <Button
            asChild
            className={BUTTON_PRIMARY_CLASSES}
          >
            <Link href="/forgot-password">
              <RefreshCw className="mr-2 h-4 w-4" />
              {FORM_MESSAGES.REQUEST_NEW_LINK}
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <AuthCard
      title={FORM_MESSAGES.RESET_PASSWORD_TITLE}
      description={FORM_MESSAGES.RESET_PASSWORD_DESCRIPTION}
      footer={
        <>
          <Button
            type="submit"
            form="reset-password-form"
            className={BUTTON_PRIMARY_CLASSES}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {FORM_MESSAGES.RESETTING}
              </span>
            ) : (
              FORM_MESSAGES.RESET_PASSWORD
            )}
          </Button>
          <div className="flex gap-4 text-sm text-muted-foreground">
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
        </>
      }
    >
      <AuthFormWrapper showSocialLogin={false}>
        <Alert className="mb-6">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Create a strong password for your account.
          </AlertDescription>
        </Alert>

        <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    New Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="password"
                    placeholder={FORM_MESSAGES.PASSWORD}
                    autoComplete={FORM_MESSAGES.AUTOCOMPLETE.NEW_PASSWORD}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className={cn(INPUT_CLASSES, fieldState.invalid && "border-destructive")}
                    onChange={(e) => {
                      field.onChange(e)
                      setPassword(e.target.value)
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <PasswordStrengthIndicator password={password} className="mt-2" />
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="confirmPassword"
                    placeholder={FORM_MESSAGES.PASSWORD}
                    autoComplete={FORM_MESSAGES.AUTOCOMPLETE.NEW_PASSWORD}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className={cn(INPUT_CLASSES, fieldState.invalid && "border-destructive")}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </AuthFormWrapper>
    </AuthCard>
  )
}