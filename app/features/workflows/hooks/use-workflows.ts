/**
 * Hook to fetch all workflows using suspense
 */

import React, { useState, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useSuspenseQuery({
        ...trpc.workflows.getMany.queryOptions(params),
        staleTime: 2 * 60 * 1000, // 2 分钟内数据新鲜，不重新请求
        gcTime: 5 * 60 * 1000,    // 缓存 5 分钟
    });
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


/**
 * Hook to fetch a single workflow using suspense
 */
export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery({
        ...trpc.workflows.getOne.queryOptions({ id }),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};

/**
 * Hook to update a workflow name
 */
export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" updated`);
                // Invalidate both single workflow and list queries
                queryClient.invalidateQueries({
                    queryKey: trpc.workflows.getOne.queryKey({ id: data.id })
                });
                queryClient.invalidateQueries({
                    queryKey: trpc.workflows.getMany.queryKey()
                });
            },
            onError: (error) => {
                toast.error(`Failed to update workflow: ${error.message}`);
            },
        })
    );
};

/**
 * Hook for inline editing of workflow name
 * Manages edit state, input value, and save/cancel actions
 */
export const useEditWorkflowName = (workflowId: string, initialName: string) => {
    const updateWorkflow = useUpdateWorkflow();
    const [editName, setEditName] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);
    const isEditingRef = useRef(isEditing);

    // Keep ref in sync
    React.useEffect(() => {
        isEditingRef.current = isEditing;
    }, [isEditing]);

    // Sync with initialName changes only when not editing
    React.useEffect(() => {
        if (!isEditingRef.current) {
            setEditName(initialName);
        }
    }, [initialName]);

    const startEditing = React.useCallback(() => {
        setEditName(initialName);
        setIsEditing(true);
    }, [initialName]);

    const cancelEditing = React.useCallback(() => {
        setEditName(initialName);
        setIsEditing(false);
    }, [initialName]);

    const saveEditing = React.useCallback(() => {
        const trimmedName = editName.trim();
        if (trimmedName && trimmedName !== initialName) {
            updateWorkflow.mutate(
                { id: workflowId, name: trimmedName },
                {
                    onSuccess: () => setIsEditing(false),
                }
            );
        } else {
            cancelEditing();
        }
    }, [editName, initialName, workflowId, updateWorkflow, cancelEditing]);

    return {
        editName,
        setEditName,
        isEditing,
        startEditing,
        cancelEditing,
        saveEditing,
        isSaving: updateWorkflow.isPending,
    };
};