"use client"
import {
    EntityContainer,
    EntityHeader,
    EntitySearch,
    EntityPagination,
} from "@/components/entity-components";
import {
    useCreateWorkflow,
    useSuspenseWorkflows
} from "../hooks/use-workflows"
import { useWorkflowsSearch } from "../hooks/use-workflows-search";
import { useWorkflowsPagination } from "../hooks/use-workflows-pagination";
import React from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";


export const WrokflowsList = () => {
    const workflows = useSuspenseWorkflows();
    const { search, onSearchChange } = useWorkflowsSearch();
    const { page, pageSize, setPage } = useWorkflowsPagination();

    return (
        <div className="flex-1">
            <pre>
                {JSON.stringify(workflows.data, null, 2)}
            </pre>
        </div>
    )
}

export const WorkflowHeader = ({disabled} : {disabled ?: boolean})=>{
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();
    const router = useRouter()
    const handleCreate = ()=>{
        createWorkflow.mutate(undefined,{
            onSuccess : (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError : handleError
        })
    }
    return (
        <>
            <EntityHeader
                title ="Workflows"
                description="Create and manage your workflow"
                onNew={handleCreate}
                newButtonLabel="New workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
            {modal}
        </>
    )
}

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