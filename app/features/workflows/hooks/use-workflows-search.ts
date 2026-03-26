import { useWorkflowsParams } from "./use-workflows-params";
import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Hook for workflows search with local state and debounced URL sync
 *
 * Design:
 * - Local state for immediate input feedback
 * - Debounced URL update (500ms after typing stops)
 * - URL -> local state sync only on navigation/back button
 */
export const useWorkflowsSearch = () => {
	const [params, setParams] = useWorkflowsParams();
	// 本地状态用于输入框，避免每次 URL 更新都触发重渲染
	const [inputValue, setInputValue] = useState(() => params.search);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const paramsRef = useRef(params.search);

	// 保持 paramsRef 同步
	useEffect(() => {
		paramsRef.current = params.search;
	}, [params.search]);

	// 只在 URL 参数与本地状态不一致时同步（后退按钮等场景）
	useEffect(() => {
		// 只有当用户完成输入后（定时器已执行），才同步 URL 到本地
		if (!debounceTimerRef.current && paramsRef.current !== inputValue) {
			setInputValue(paramsRef.current);
		}
	}, [inputValue]);

	const handleSearchChange = useCallback(
		(newValue: string) => {
			// 立即更新本地状态，输入框立即响应
			setInputValue(newValue);

			// 清除之前的定时器
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			// 防抖 600ms 后更新 URL（平衡响应速度和查询性能）
			debounceTimerRef.current = setTimeout(() => {
				setParams((prev) => ({
					page: prev.search === newValue ? prev.page : 1,
					search: newValue,
				}));
				// 清除定时器引用，标记输入完成
				debounceTimerRef.current = null;
			}, 600);
		},
		[setParams],
	);

	// 组件卸载时清理定时器
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const resetSearch = useCallback(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		setInputValue("");
		setParams({ page: 1, search: "" });
	}, [setParams]);

	return {
		search: inputValue,
		onSearchChange: handleSearchChange,
		resetSearch,
		isSearching: inputValue !== "",
	};
};
