/**
 * External dependencies.
 */
import { cloneDeep } from 'lodash';
import { computed, Ref, ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQuery, { QueryCallback, QueryOptions } from '@/vue/query/useQuery';
import useQueryKeyWatcher from '@/vue/query/useQueryKeyWatcher';

export default function usePaginateQuery<TData, TError>(
    key: string | Array<string | Ref>,
    callback: QueryCallback<TData> | null = null,
    options: Partial<QueryOptions<TData, TError>> = {},
) {
    const currentPage = ref(1);
    const queryCachedData = ref(options.defaultData);
    const requestHasNextPage = ref({
        1: false,
    });
    const triggerQuery = () => query.refetch([currentPage.value, ...variables]);
    const fetchPrevPage = () => {
        if (query.isFetching.value || currentPage.value <= 1) {
            return;
        }

        currentPage.value = currentPage.value - 1;
        triggerQuery();
    };
    const fetchNextPage = () => {
        if (query.isFetching.value || !requestHasNextPage.value[currentPage.value]) {
            return;
        }

        currentPage.value = currentPage.value + 1;
        triggerQuery();
    };
    const reset = () => {
        currentPage.value = 1;
        triggerQuery();
    };

    key = Array.isArray(key) ? [...key.slice(0, 1), { page: currentPage }, ...key.slice(1)] : [key, currentPage];
    const { variables } = useQueryKeyWatcher({
        key,
        callback: reset,
        doNotWatchForKeys: ['page'],
    });

    const query = useQuery(
        key,
        callback,
        {
            ...options,
            onDataReceive: response => {
                const { data: responseData, hasNextPage } = response;
                requestHasNextPage.value = {
                    ...requestHasNextPage.value,
                    [currentPage.value]: hasNextPage,
                };

                queryCachedData.value = cloneDeep(responseData);

                options.onDataReceive && options.onDataReceive(responseData);
            },
        },
    );
    const hasMorePages = computed(() => requestHasNextPage.value[currentPage.value]);
    query.refetch();

    return {
        ...query,
        fetchPrevPage,
        fetchNextPage,
        hasMorePages,
        data: computed(() => queryCachedData.value),
        currentPage: computed(() => currentPage.value),
        isNextButtonActive: computed(() => hasMorePages.value),
        isPrevButtonActive: computed(() => currentPage.value > 1),

        // show pagination buttons if the page 1 has more pages
        canShowPaginationButtons: computed(() => requestHasNextPage.value[1]),
    };
}
