"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "./auth-card";
import { AuthFormWrapper } from "./auth-form-wrapper";
import {
	FORM_MESSAGES,
	SOCIAL_PROVIDERS,
	INPUT_CLASSES,
	BUTTON_PRIMARY_CLASSES,
} from "../constants";

const formSchema = z.object({
	email: z
		.string()
		.min(1, FORM_MESSAGES.EMAIL_REQUIRED)
		.email(FORM_MESSAGES.EMAIL_INVALID),
	password: z.string().min(1, FORM_MESSAGES.PASSWORD_REQUIRED),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const isPending = form.formState.isSubmitting;

	async function onSubmit(data: FormData) {
		await authClient.signIn.email(
			{
				email: data.email,
				password: data.password,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					toast.success(FORM_MESSAGES.LOGIN_SUCCESS);
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	}

	const handleSocialLogin = async (
		provider: (typeof SOCIAL_PROVIDERS)[keyof typeof SOCIAL_PROVIDERS],
	) => {
		await authClient.signIn.social(
			{
				provider,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					toast.success(FORM_MESSAGES.SOCIAL_LOGIN_SUCCESS(provider));
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	};

	return (
		<AuthCard
			title={FORM_MESSAGES.LOGIN_TITLE}
			description={FORM_MESSAGES.LOGIN_DESCRIPTION}
			footer={
				<>
					<Button
						type="submit"
						form="login-form"
						className={BUTTON_PRIMARY_CLASSES}
						disabled={isPending}
					>
						{isPending ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Signing in...
							</span>
						) : (
							FORM_MESSAGES.LOGIN
						)}
					</Button>
					<div className="flex items-center justify-between w-full text-sm">
						<Link
							href="/forgot-password"
							className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							Forgot password?
						</Link>
					</div>
					<p className="text-center text-sm text-muted-foreground">
						{FORM_MESSAGES.DONT_HAVE_ACCOUNT}{" "}
						<Link
							href="/register"
							className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
						>
							{FORM_MESSAGES.SIGN_UP}
						</Link>
					</p>
				</>
			}
		>
			<AuthFormWrapper
				socialLoginType="login"
				onSocialLogin={handleSocialLogin}
				isPending={isPending}
			>
				<form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
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
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel
										htmlFor="password"
										className="flex items-center gap-2"
									>
										<Lock className="h-4 w-4" />
										Password
									</FieldLabel>
									<PasswordInput
										{...field}
										id="password"
										placeholder={FORM_MESSAGES.PASSWORD}
										autoComplete={FORM_MESSAGES.AUTOCOMPLETE.CURRENT_PASSWORD}
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
