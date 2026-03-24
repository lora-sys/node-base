"use client"
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import React from "react";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";


export const WrokflowsList = () => {
    const workflows= useSuspenseWorkflows();

    return (
        <div className="flex-1 justify-center items-center">
            <pre>
             {JSON.stringify(workflows.data,null,2)}
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


export const WorkflowContainer = ({children} : {
    children : React.ReactNode;
} )=>{

    return (
        <EntityContainer
        header ={<WorkflowHeader/>}
        search={<></>}
        pagination={<></>}
        >
        {children} 
        </EntityContainer>
    )
}