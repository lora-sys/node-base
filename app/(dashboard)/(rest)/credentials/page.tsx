import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
	await requireAuth();
	return <p>credentials page</p>;
};

export default Page;
