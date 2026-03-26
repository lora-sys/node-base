import {
	Editor,
	EditorError,
	EditorLoading,
} from "@/app/features/editor/components/editor";
import { prefetchWorkflow } from "@/app/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	params: Promise<{ workflowsId: string }>;
};

const Page = async ({ params }: Props) => {
	await requireAuth();
	const { workflowsId } = await params;
	await prefetchWorkflow(workflowsId);
	return (
		<HydrateClient>
			<ErrorBoundary fallback={<EditorError />}>
				<Suspense fallback={<EditorLoading />}>
					<Editor workflowId={workflowsId} />
				</Suspense>
			</ErrorBoundary>
		</HydrateClient>
	);
};

export default Page;
