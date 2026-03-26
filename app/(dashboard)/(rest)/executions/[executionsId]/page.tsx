import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
	params: Promise<{
		executionsId: string;
	}>;
}

const Page = async ({ params }: PageProps) => {
	await requireAuth();
	const { executionsId } = await params;
	return <p>executions id : {executionsId} page</p>;
};

export default Page;
