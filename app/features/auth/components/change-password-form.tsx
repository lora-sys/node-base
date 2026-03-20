"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as z from "zod"
import { Loader2, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
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
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, FORM_MESSAGES.PASSWORD_REQUIRED)
      .min(8, FORM_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(1, FORM_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: FORM_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export function ChangePasswordForm() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const isPending = form.formState.isSubmitting

  async function onSubmit(data: FormData) {
    await authClient.changePassword(
      {
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      },
      {
        onSuccess: () => {
          toast.success(FORM_MESSAGES.CHANGE_PASSWORD_SUCCESS)
          form.reset()
          setPassword("")
          router.push("/")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        },
      }
    )
  }

  return (
    <AuthCard
      title={FORM_MESSAGES.CHANGE_PASSWORD_TITLE}
      description={FORM_MESSAGES.CHANGE_PASSWORD_DESCRIPTION}
      footer={
        <Button
          type="submit"
          form="change-password-form"
          className={BUTTON_PRIMARY_CLASSES}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {FORM_MESSAGES.CHANGING}
            </span>
          ) : (
            FORM_MESSAGES.CHANGE_PASSWORD
          )}
        </Button>
      }
    >
      <AuthFormWrapper showSocialLogin={false}>
        <form id="change-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="currentPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Current Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="currentPassword"
                    placeholder={FORM_MESSAGES.PASSWORD}
                    autoComplete={FORM_MESSAGES.AUTOCOMPLETE.CURRENT_PASSWORD}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className={cn(INPUT_CLASSES, fieldState.invalid && "border-destructive")}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    New Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="newPassword"
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
                    Confirm New Password
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