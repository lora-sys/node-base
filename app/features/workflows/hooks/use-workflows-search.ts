import { useEntitySearch } from "@/hooks/use-entity-search";
import { useWorkflowsParams } from "./use-workflows-params";

/**
 * Hook for workflows search with URL state synchronization
 */
export const useWorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { value, onChange, reset, isSearching } = useEntitySearch({
        key: "search",
        debounceMs: 300,
        defaultValue: "",
    });

    const handleSearchChange = (newValue: string) => {
        onChange(newValue);
        // Reset to page 1 when search changes
        setParams({ page: 1 });
    };

    return {
        search: value,
        onSearchChange: handleSearchChange,
        resetSearch: reset,
        isSearching,
    };
};
