"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "../../workflows/hooks/use-workflows";
import { EditorHeader } from "./editor-header";

export const EditorLoading = () => {
	return (
		<>
			<LoadingView message="Loading Editor" />
		</>
	);
};

export const EditorError = () => {
	return (
		<>
			<ErrorView message="Error Loading Editor" />
		</>
	);
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);

	return (
		<div className="flex flex-col h-full">
			<EditorHeader workflowId={workflowId} />
			<main className="flex-1 overflow-auto p-4">
				<pre className="text-sm">{JSON.stringify(workflow, null, 2)}</pre>
			</main>
		</div>
	);
};
