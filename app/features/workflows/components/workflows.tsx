"use client"
import {
    EntityContainer,
    EntityHeader,
    EntitySearch,
    EntityPagination,
    LoadingView,
    EmptyView,
    EntityList,
    EntityItem,
    ErrorView,
} from "@/components/entity-components";
import {
    useCreateWorkflow,
    useSuspenseWorkflows,
    useDeleteWorkflow,
} from "../hooks/use-workflows";
import { useWorkflowsSearch } from "../hooks/use-workflows-search";
import { useWorkflowsPagination } from "../hooks/use-workflows-pagination";
import React from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { WorkflowModel } from "@/lib/generated/prisma/models";
import { WorkflowIcon, CalendarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();
    return (
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}
        />
    );
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: handleError,
        });
    };

    return (
        <>
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
            {modal}
        </>
    );
};

// Internal client component that provides search and pagination
const WorkflowSearch = () => {
    const { search, onSearchChange } = useWorkflowsSearch();
    return (
        <EntitySearch
            value={search}
            onChange={onSearchChange}
            placeholder="Search workflows..."
        />
    );
};

const WorkflowPagination = () => {
    const workflows = useSuspenseWorkflows();
    const { page, pageSize, setPage } = useWorkflowsPagination();
    return (
        <EntityPagination
            page={page}
            pageSize={pageSize}
            total={workflows.data.totalCount}
            onPageChange={setPage}
        />
    );
};

export const WorkflowContainer = ({
    children,
    header,
    search,
    pagination,
}: {
    children: React.ReactNode;
    header?: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={header ?? <WorkflowHeader />}
            search={search ?? <WorkflowSearch />}
            pagination={pagination ?? <WorkflowPagination />}
        >
            {children}
        </EntityContainer>
    );
};

export const WorkflowsLoading = () => {
    return <LoadingView entity="workflows" message="Loading workflows..." />;
};

export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: handleError,
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
        });
    };

    return (
        <>
            {modal}
            <EmptyView
                entity="workflows"
                title="No workflows yet"
                description="Create your first workflow to get started"
                onNew={handleCreate}
            />
        </>
    );
};

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

export const WorkflowItem = ({ data }: { data: WorkflowModel }) => {
    const deleteWorkflow = useDeleteWorkflow();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this workflow?")) {
            return;
        }
        await deleteWorkflow.mutateAsync({ id: data.id });
    };

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <div className="flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5" />
                    <span>Created {formatDistanceToNow(data.createdAt, { addSuffix: true })}</span>
                </div>
            }
            image={
                <div className="size-9 sm:size-10 flex items-center justify-center rounded-md bg-muted">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleDelete}
            isRemoving={deleteWorkflow.isPending}
        />
    );
};