import { useWorkflowsParams } from "./use-workflows-params";
import { PAGINATION } from "@/config/constants";

/**
 * Hook for workflows pagination with URL state synchronization
 */
export const useWorkflowsPagination = () => {
    const [params, setParams] = useWorkflowsParams();

    const page = params.page;
    const pageSize = params.pageSize;

    const setPage = (newPage: number) => {
        setParams({ page: newPage });
    };

    const setPageSize = (newPageSize: number) => {
        setParams({ 
            pageSize: newPageSize,
            page: PAGINATION.DEFAULT_PAGE, // Reset to first page when changing page size
        });
    };

    const nextPage = () => {
        setParams({ page: page + 1 });
    };

    const prevPage = () => {
        setParams({ page: Math.max(1, page - 1) });
    };

    return {
        page,
        pageSize,
        setPage,
        setPageSize,
        nextPage,
        prevPage,
    };
};
