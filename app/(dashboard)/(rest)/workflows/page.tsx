import {
	WorkflowContainer,
	WorkflowsLoading,
	WorkflowsList,
	WorkflowsErrorWithRetry,
} from "@/app/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/app/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/app/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
	await requireAuth();
	const params = await workflowsParamsLoader(searchParams);
	await prefetchWorkflows(params);
	return (
		<WorkflowContainer>
			<HydrateClient>
				<ErrorBoundary fallback={<WorkflowsErrorWithRetry />}>
					<Suspense fallback={<WorkflowsLoading />}>
						<WorkflowsList />
					</Suspense>
				</ErrorBoundary>
			</HydrateClient>
		</WorkflowContainer>
	);
};

export default Page;
