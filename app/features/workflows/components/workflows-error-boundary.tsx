"use client";

import { ErrorView } from "@/components/entity-components";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const WorkflowsErrorWithRetry = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const handleRetry = () => {
        queryClient.invalidateQueries({ queryKey: trpc.workflows.getMany.queryKey() });
    };
    return (
        <ErrorView
            entity="workflows"
            message="Failed to load workflows. Please try again."
            onRetry={handleRetry}
        />
    );
};
