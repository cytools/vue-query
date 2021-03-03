/**
 * External dependencies.
 */
import { ref, Ref, watch, computed } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQuery, { QueryCallback, QueryOptions } from '@/vue/query/useQuery';
import useQueryKeyWatcher from '@/vue/query/useQueryKeyWatcher';
import { queryDataClone } from '@/core/query/Query';

export default function usePaginateQuery<TData, TError = any>(
    key: string | Array<string | Ref | { [key: string]: Ref }>,
    callback: QueryCallback<{ data: TData, hasNextPage: boolean }> | null = null,
    options: Partial<QueryOptions<{ data: TData, hasNextPage: boolean }, TError>> = {},
) {
    const currentPage = ref(1);
    const queryCachedData = ref(options.defaultData || null);
    const requestHasNextPage: Ref<{ [key: number]: boolean }> = ref({
        1: false,
    });
    const triggerQuery = () => query.fetchFromCacheOrRefetch([currentPage.value, ...variables]);
    const fetchPrevPage = async () => {
        if (query.isFetching.value || currentPage.value <= 1) {
            return;
        }

        currentPage.value = currentPage.value - 1;
        await triggerQuery();
    };
    const fetchNextPage = async () => {
        if (query.isFetching.value || !requestHasNextPage.value[currentPage.value]) {
            return;
        }

        currentPage.value = currentPage.value + 1;
        await triggerQuery();
    };
    const reset = async () => {
        currentPage.value = 1;
        await triggerQuery();
    };

    key = Array.isArray(key) ? [...key.slice(0, 1), { page: currentPage }, ...key.slice(1)] : [key, { page: currentPage }];
    const { variables } = useQueryKeyWatcher({
        key,
        callback: reset,
        keysNotToWatch: ['page'],
    });

    const query = useQuery(
        key,
        callback,
        {
            ...options,
            manual: true,
            keepPreviousData: true,
        },
    );
    const hasMorePages = computed(() => requestHasNextPage.value[currentPage.value]);
    const init = ({ data = null, hasNextPage = true }: any = {}) => {
        if (data) {
            queryCachedData.value = queryDataClone(data);
        }

        requestHasNextPage.value = {
            ...requestHasNextPage.value,
            [currentPage.value]: query.isSuccess.value && hasNextPage,
        };
    };

    void triggerQuery();

    // there is some kind of a bug when we us the immediate watcher with the query.data
    // so we initialize the data ourselfs
    init(query.data.value || {});
    watch(query.data, init);

    return {
        ...query,
        fetchPrevPage,
        fetchNextPage,
        hasMorePages,
        data: computed(() => queryCachedData.value),
        currentPage: computed(() => currentPage.value),
        isNextButtonActive: computed(() => hasMorePages.value),
        isPrevButtonActive: computed(() => currentPage.value > 1),
        isSuccess: computed(() => query.isSuccess || queryCachedData.value),

        // show pagination buttons if the page 1 has more pages
        canShowPaginationButtons: computed(() => requestHasNextPage.value[1]),
    };
}
