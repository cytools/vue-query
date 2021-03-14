/**
 * External dependencies.
 */
import { computed, watch, Ref, ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import usePaginateQuery from '@/vue/query/usePaginateQuery';
import { QueryCallback, QueryOptions } from '@/vue/query/useQuery';

export default function useInfiniteQuery<TData, TError = any>(
    key: string | Array<string | Ref | { [key: string]: Ref }>,
    callback: QueryCallback<{ data: TData[], hasNextPage: boolean }> | null = null,
    options: Partial<QueryOptions<{ data: TData[], hasNextPage: boolean }, TError>> = {},
) {
    const queryCachedData = ref([]);
    const {
        data,
        isSuccess,
        isFetching,
        isError,
        isLoading,
        isIdle,
        error,
        status,
        hasMorePages,
        fetchNextPage,
    } = usePaginateQuery(key, callback, options);

    watch(data, (newData) => {
        if (!Array.isArray(newData)) {
            return;
        }

        queryCachedData.value = [...queryCachedData.value, ...newData] as any;
    }, { immediate: true });

    return {
        error,
        status,
        isIdle,
        isError,
        isFetching,
        isLoading,
        fetchMore: fetchNextPage,
        canFetchMore: hasMorePages,
        data: computed(() => queryCachedData.value),
        isSuccess: computed(() => isSuccess.value || queryCachedData.value),
    };
}
