import { useWorkflowsParams } from "./use-workflows-params";

/**
 * Hook for workflows search with URL state synchronization
 */
export const useWorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();

    const handleSearchChange = (newValue: string) => {
        setParams({ page: 1, search: newValue });
    };

    const resetSearch = () => {
        setParams({ page: 1, search: "" });
    };

    return {
        search: params.search,
        onSearchChange: handleSearchChange,
        resetSearch,
        isSearching: params.search !== "",
    };
};
