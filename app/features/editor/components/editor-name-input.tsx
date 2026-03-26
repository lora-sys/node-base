"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon, PencilIcon } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useUpdateWorkflow } from "@/app/features/workflows/hooks/use-workflows";
import React from "react";

interface EditorNameInputProps {
    workflowId: string;
    initialName: string;
}

const MAX_NAME_LENGTH = 50;

/**
 * 可编辑的工作流名称输入框
 * 支持点击编辑、保存、取消
 */
export const EditorNameInput = ({ workflowId, initialName }: EditorNameInputProps) => {
    const updateWorkflow = useUpdateWorkflow();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(initialName);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const inputRef = useRef<HTMLInputElement>(null);
    const isEditingRef = useRef(isEditing);

    // 保持 ref 同步
    React.useEffect(() => {
        isEditingRef.current = isEditing;
    }, [isEditing]);

    // 同步 initialName 变化 - 只在非编辑状态下同步
    React.useEffect(() => {
        if (!isEditingRef.current) {
            setEditName(initialName);
        }
    }, [initialName]);

    // 进入编辑模式时聚焦
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // 验证错误
    const validationError = useMemo(() => {
        if (!editName.trim()) return 'Name cannot be empty';
        if (editName.length > MAX_NAME_LENGTH) return `Name too long (max ${MAX_NAME_LENGTH} chars)`;
        return null;
    }, [editName]);

    const handleSave = () => {
        const trimmedName = editName.trim();
        if (trimmedName && !validationError) {
            updateWorkflow.mutate(
                { id: workflowId, name: trimmedName },
                {
                    onSuccess: () => {
                        setSaveStatus('success');
                        setTimeout(() => {
                            setSaveStatus('idle');
                            setIsEditing(false);
                        }, 1000);
                    },
                    onError: () => {
                        setSaveStatus('error');
                    },
                }
            );
        }
    };

    const handleCancel = () => {
        setEditName(initialName);
        setIsEditing(false);
        setSaveStatus('idle');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    // 保存中禁用输入
    const isDisabled = updateWorkflow.isPending;

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    ref={inputRef}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isDisabled}
                    className="h-7 min-w-48 max-w-[320px] text-sm"
                />
                <div className="flex items-center gap-1">
                    <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={handleSave}
                        disabled={isDisabled || !!validationError}
                        className="h-7 w-7"
                        title="Save (Enter)"
                    >
                        {saveStatus === 'success' ? (
                            <CheckIcon className="size-4 text-green-500" />
                        ) : saveStatus === 'error' ? (
                            <XIcon className="size-4 text-destructive" />
                        ) : (
                            <CheckIcon className="size-4" />
                        )}
                    </Button>
                    <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isDisabled}
                        className="h-7 w-7"
                        title="Cancel (Esc)"
                    >
                        <XIcon className="size-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Button
            variant="link"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-auto p-0 gap-1.5 hover:no-underline"
        >
            <span className="text-sm font-medium hover:underline decoration-border">{initialName}</span>
            <PencilIcon className="size-3 text-muted-foreground opacity-0 group-hover/button:opacity-100 transition-opacity" />
        </Button>
    );
};
