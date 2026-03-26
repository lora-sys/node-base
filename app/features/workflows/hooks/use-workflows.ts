/**
 * Hook to fetch all workflows using suspense
 */

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Hook to create a new workflow
 */
export const useCreateWorkflow = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" created`);
                router.push(`/workflows/${data.id}`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions(params)
                );
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`);
            },
        })
    );
};

/**
 * Hook to delete a workflow
 */
export const useDeleteWorkflow = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: () => {
                toast.success("Workflow deleted");
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions(params)
                );
            },
            onError: (error) => {
                toast.error(`Failed to delete workflow: ${error.message}`);
            },
        })
    );
};