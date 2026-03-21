"use client";

import { usePasswordStrength } from "@/hooks/use-auth-form";

interface PasswordStrengthIndicatorProps {
	password: string;
	className?: string;
}

/**
 * 密码强度指示器
 *
 * 显示密码强度进度条和建议
 */
export function PasswordStrengthIndicator({
	password,
	className = "",
}: PasswordStrengthIndicatorProps) {
	const strength = usePasswordStrength(password);

	const isShowing = password.length > 0;

	if (!isShowing) return null;

	return (
		<div className={`space-y-2 ${className}`}>
			{/* 进度条 */}
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5, 6].map((level) => (
					<div
						key={level}
						className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
							level <= strength.score
								? strength.color
								: "bg-gray-200 dark:bg-gray-700"
						}`}
					/>
				))}
			</div>

			{/* 强度标签和建议 */}
			<div className="flex items-center justify-between text-xs">
				<span className="font-medium text-muted-foreground">
					{strength.label}
				</span>
				{strength.feedback.length > 0 && (
					<span className="text-muted-foreground">
						Add: {strength.feedback.slice(0, 2).join(", ")}
					</span>
				)}
			</div>
		</div>
	);
}
