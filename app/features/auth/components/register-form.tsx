"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Loader2, Mail, Lock, User } from "lucide-react";
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
import { PasswordStrengthIndicator } from "@/components/ui/password-strength";
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

const formSchema = z
	.object({
		name: z
			.string()
			.min(1, FORM_MESSAGES.NAME_REQUIRED)
			.min(2, FORM_MESSAGES.NAME_MIN_LENGTH),
		email: z
			.string()
			.min(1, FORM_MESSAGES.EMAIL_REQUIRED)
			.email(FORM_MESSAGES.EMAIL_INVALID),
		password: z
			.string()
			.min(1, FORM_MESSAGES.PASSWORD_REQUIRED)
			.min(8, FORM_MESSAGES.PASSWORD_MIN_LENGTH),
		confirmPassword: z.string().min(1, FORM_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: FORM_MESSAGES.PASSWORDS_DO_NOT_MATCH,
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof formSchema>;

export function RegisterForm() {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const isPending = form.formState.isSubmitting;
	const password = form.watch("password");

	async function onSubmit(data: FormData) {
		await authClient.signUp.email(
			{
				email: data.email,
				password: data.password,
				name: data.name,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					toast.success(FORM_MESSAGES.REGISTER_SUCCESS);
					form.reset();
					router.push("/");
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
					toast.success(FORM_MESSAGES.SOCIAL_REGISTER_SUCCESS(provider));
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	};

	return (
		<AuthCard
			title={FORM_MESSAGES.REGISTER_TITLE}
			description={FORM_MESSAGES.REGISTER_DESCRIPTION}
			footer={
				<>
					<Button
						type="submit"
						form="register-form"
						className={BUTTON_PRIMARY_CLASSES}
						disabled={isPending}
					>
						{isPending ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								{FORM_MESSAGES.CREATING}
							</span>
						) : (
							FORM_MESSAGES.REGISTER
						)}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						{FORM_MESSAGES.ALREADY_HAVE_ACCOUNT}{" "}
						<Link
							href="/login"
							className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
						>
							{FORM_MESSAGES.SIGN_IN}
						</Link>
					</p>
				</>
			}
		>
			<AuthFormWrapper
				socialLoginType="register"
				onSocialLogin={handleSocialLogin}
				isPending={isPending}
			>
				<form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel
										htmlFor="name"
										className="flex items-center gap-2"
									>
										<User className="h-4 w-4" />
										Name
									</FieldLabel>
									<Input
										{...field}
										id="name"
										type="text"
										placeholder={FORM_MESSAGES.NAME}
										autoComplete={FORM_MESSAGES.AUTOCOMPLETE.NAME}
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
										autoComplete={FORM_MESSAGES.AUTOCOMPLETE.NEW_PASSWORD}
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
									<PasswordStrengthIndicator
										password={password}
										className="mt-2"
									/>
								</Field>
							)}
						/>
						<Controller
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel
										htmlFor="confirmPassword"
										className="flex items-center gap-2"
									>
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
