"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SaveIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { useSuspenseWorkflow } from "@/app/features/workflows/hooks/use-workflows";
import { EditorNameInput } from "./editor-name-input";

/**
 * 面包屑导航 - 只显示工作流名称（不可编辑）
 */
export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/workflows">Workflows</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{workflow.name}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
};

/**
 * 保存按钮 - 保存整个工作流的更改
 * TODO: 未来实现完整的工作流保存逻辑
 */
export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
	const [isSaved, setIsSaved] = useState(false);

	const handleSave = async () => {
		// TODO: 实现完整的工作流保存逻辑
		await new Promise((resolve) => setTimeout(resolve, 500));
		setIsSaved(true);
		setTimeout(() => setIsSaved(false), 2000);
	};

	return (
		<Button size="sm" onClick={handleSave} disabled={false} className="gap-2">
			{isSaved ? (
				<>
					<CheckIcon className="size-4 text-green-500" />
					<span className="hidden sm:inline">Saved</span>
				</>
			) : (
				<>
					<SaveIcon className="size-4" />
					<span className="hidden sm:inline">Save</span>
				</>
			)}
		</Button>
	);
};

/**
 * 编辑器头部
 * 包含：侧边栏触发器 + 面包屑导航 + 保存按钮
 */
export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
			<SidebarTrigger />
			<div className="flex flex-1 items-center justify-between gap-x-4">
				{/* 左侧：面包屑 + 可编辑名称 */}
				<div className="flex items-center gap-4">
					<EditorBreadcrumbs workflowId={workflowId} />
					<EditorNameInput
						workflowId={workflowId}
						initialName={workflow.name}
					/>
				</div>
				{/* 右侧：保存按钮 */}
				<EditorSaveButton workflowId={workflowId} />
			</div>
		</header>
	);
};
