"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { ResetPasswordForm } from "@/app/features/auth/components/reset-password-form";
import { AuthBackground } from "@/app/features/auth/components/auth-background";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const error = searchParams.get("error");
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		async function checkSession() {
			try {
				const session = await authClient.getSession({
					fetchOptions: {
						credentials: "include",
					},
				});
				if (session.data) {
					router.replace("/");
				}
			} catch (error) {
				// 未登录，继续显示页面
			} finally {
				setIsChecking(false);
			}
		}

		checkSession();
	}, [router]);

	if (isChecking) {
		return (
			<AuthBackground>
				<div className="flex items-center justify-center">
					<div className="text-center text-muted-foreground">Loading...</div>
				</div>
			</AuthBackground>
		);
	}

	return (
		<AuthBackground>
			<ResetPasswordForm token={token} error={error} />
		</AuthBackground>
	);
}
