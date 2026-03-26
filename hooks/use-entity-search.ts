import { useQueryState } from "nuqs";

interface UseEntitySearchOptions<T extends string> {
    key?: string;
    debounceMs?: number;
    defaultValue?: T;
    clearOnDefault?: boolean;
}

/**
 * Hook for entity search with URL state synchronization
 * Uses nuqs for URL state management
 */
export function useEntitySearch<T extends string = string>({
    key = "search",
    debounceMs = 300,
    defaultValue = "" as T,
    clearOnDefault = true,
}: UseEntitySearchOptions<T> = {}) {
    const [value, setValue] = useQueryState(key, {
        clearOnDefault,
    });

    const onChange = (newValue: string) => {
        setValue(newValue === "" ? null : newValue as T);
    };

    const reset = () => {
        setValue(null);
    };

    return {
        value: (value ?? defaultValue) as T,
        onChange,
        reset,
        isSearching: value !== null && value !== "",
    };
}
