"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
	showToggle?: boolean;
}

export function PasswordInput({
	showToggle = true,
	className,
	type,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = React.useState(false);

	if (!showToggle) {
		return <Input type="password" {...props} className={className} />;
	}

	return (
		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				{...props}
				className={cn("pr-10", className)}
			/>
			<button
				type="button"
				onClick={() => setShowPassword(!showPassword)}
				onMouseDown={(e) => e.preventDefault()}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4" />
				) : (
					<Eye className="h-4 w-4" />
				)}
			</button>
		</div>
	);
}
