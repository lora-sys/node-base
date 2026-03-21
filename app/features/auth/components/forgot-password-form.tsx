"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "./auth-card";
import { AuthFormWrapper } from "./auth-form-wrapper";
import {
	FORM_MESSAGES,
	INPUT_CLASSES,
	BUTTON_PRIMARY_CLASSES,
} from "../constants";

const formSchema = z.object({
	email: z
		.string()
		.min(1, FORM_MESSAGES.EMAIL_REQUIRED)
		.email(FORM_MESSAGES.EMAIL_INVALID),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
	const [email, setEmail] = React.useState("");
	const [isSuccess, setIsSuccess] = React.useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const isPending = form.formState.isSubmitting;

	async function onSubmit(data: FormData) {
		setEmail(data.email);
		await authClient.requestPasswordReset(
			{
				email: data.email,
				redirectTo: "/reset-password",
			},
			{
				onSuccess: () => {
					toast.success(FORM_MESSAGES.PASSWORD_RESET_SENT);
					setIsSuccess(true);
					form.reset();
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	}

	if (isSuccess) {
		return (
			<AuthCard
				title={FORM_MESSAGES.CHECK_YOUR_EMAIL}
				description=""
				footer={
					<>
						<Button
							onClick={() => setIsSuccess(false)}
							className={BUTTON_PRIMARY_CLASSES}
							disabled={isPending}
						>
							{FORM_MESSAGES.SEND_ANOTHER_LINK}
						</Button>
						<p className="text-center text-sm text-muted-foreground">
							<Link
								href="/login"
								className="flex items-center justify-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
							>
								<ArrowLeft className="h-3 w-3" />
								{FORM_MESSAGES.BACK_TO_SIGN_IN}
							</Link>
						</p>
					</>
				}
				showLogo={false}
			>
				<div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
					<CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
				</div>
				<p className="text-center text-base mb-6">
					{FORM_MESSAGES.WEVE_SENT_LINK}
					<span className="font-semibold text-foreground block mt-2">
						{email}
					</span>
				</p>
				<Alert>
					<AlertDescription>
						If you don&apos;t receive the email within a few minutes, please
						check your spam folder.
					</AlertDescription>
				</Alert>
			</AuthCard>
		);
	}

	return (
		<AuthCard
			title={FORM_MESSAGES.FORGOT_PASSWORD_TITLE}
			description={FORM_MESSAGES.FORGOT_PASSWORD_DESCRIPTION}
			footer={
				<>
					<Button
						type="submit"
						form="forgot-password-form"
						className={BUTTON_PRIMARY_CLASSES}
						disabled={isPending}
					>
						{isPending ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								{FORM_MESSAGES.SENDING}
							</span>
						) : (
							FORM_MESSAGES.SEND_RESET_LINK
						)}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						<Link
							href="/login"
							className="flex items-center justify-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							<ArrowLeft className="h-3 w-3" />
							{FORM_MESSAGES.BACK_TO_SIGN_IN}
						</Link>
					</p>
				</>
			}
		>
			<AuthFormWrapper showSocialLogin={false}>
				<form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel
										htmlFor="email"
										className="flex items-center gap-2"
									>
										<Mail className="h-4 w-4" />
										Email
									</FieldLabel>
									<Input
										{...field}
										id="email"
										type="email"
										placeholder={FORM_MESSAGES.EMAIL}
										autoComplete={FORM_MESSAGES.AUTOCOMPLETE.EMAIL}
										aria-invalid={fieldState.invalid}
										disabled={isPending}
										className={cn(
											INPUT_CLASSES,
											fieldState.invalid && "border-destructive",
										)}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</AuthFormWrapper>
		</AuthCard>
	);
}
