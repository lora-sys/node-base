import { useState, useMemo } from "react";
import type { z } from "zod";

/**
 * 密码强度检查
 */
export function usePasswordStrength(password: string) {
	return useMemo(() => {
		let score = 0;
		const feedback: string[] = [];

		if (password.length >= 8) score += 1;
		else if (password.length > 0) feedback.push("At least 8 characters");

		if (password.length >= 12) score += 1;

		if (/[a-z]/.test(password)) score += 1;
		else if (password.length > 0) feedback.push("Include lowercase letters");

		if (/[A-Z]/.test(password)) score += 1;
		else if (password.length > 0) feedback.push("Include uppercase letters");

		if (/[0-9]/.test(password)) score += 1;
		else if (password.length > 0) feedback.push("Include numbers");

		if (/[^a-zA-Z0-9]/.test(password)) score += 1;
		else if (password.length > 0) feedback.push("Include special characters");

		const strengthLabels = [
			"Very Weak",
			"Weak",
			"Fair",
			"Good",
			"Strong",
			"Very Strong",
		];
		const colors = [
			"bg-red-500",
			"bg-orange-500",
			"bg-yellow-500",
			"bg-lime-500",
			"bg-green-500",
			"bg-emerald-500",
		];

		return {
			score,
			maxScore: 6,
			label: password.length > 0 ? strengthLabels[Math.min(score, 5)] : "",
			color: colors[Math.min(score, 5)],
			feedback,
			percentage: password.length > 0 ? (score / 6) * 100 : 0,
		};
	}, [password]);
}

/**
 * Token 验证状态
 */
export function useTokenValidation(token: string | null) {
	const [status, setStatus] = useState<
		"idle" | "validating" | "valid" | "invalid"
	>("idle");

	const hasToken = Boolean(token);

	return {
		status,
		hasToken,
		setStatus,
	};
}

/**
 * 表单提交状态管理
 */
export function useFormSubmitStatus() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const reset = () => {
		setIsSubmitting(false);
		setError(null);
		setSuccess(false);
	};

	return {
		isSubmitting,
		error,
		success,
		setIsSubmitting,
		setError,
		setSuccess,
		reset,
	};
}

/**
 * 表单字段验证状态
 */
export function useFormValidation<
	T extends Record<string, any>,
	S extends z.ZodType<T>,
>(schema: S) {
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const validateField = (name: keyof T, value: any) => {
		try {
			// 使用 schema 进行字段级验证
			const fieldSchema = schema.shape?.[name];
			if (fieldSchema) {
				const result = fieldSchema.safeParse(value);
				if (!result.success) {
					const errorMessage =
						result.error.errors[0]?.message || "Invalid value";
					setErrors((prev) => ({ ...prev, [name as string]: errorMessage }));
					return false;
				}
			}
			setErrors((prev) => ({ ...prev, [name as string]: "" }));
			return true;
		} catch (err: any) {
			const errorMessage = err.message || "Invalid value";
			setErrors((prev) => ({ ...prev, [name as string]: errorMessage }));
			return false;
		}
	};

	const setFieldTouched = (name: keyof T) => {
		setTouched((prev) => ({ ...prev, [name as string]: true }));
	};

	const isFieldValid = (name: keyof T) => {
		return !errors[name as string];
	};

	const isFormValid = Object.values(errors).every((error) => !error);

	return {
		errors,
		touched,
		validateField,
		setFieldTouched,
		isFieldValid,
		isFormValid,
	};
}
