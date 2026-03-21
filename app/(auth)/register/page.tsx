import { requireUnauth } from "@/lib/auth-utils";
import { RegisterForm } from "@/app/features/auth/components/register-form";
import { AuthBackground } from "@/app/features/auth/components/auth-background";

export default async function RegisterPage() {
	await requireUnauth();

	return (
		<AuthBackground>
			<RegisterForm />
		</AuthBackground>
	);
}
