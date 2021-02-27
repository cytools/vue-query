/**
 * External dependencies.
 */
import { isEmpty } from 'lodash';
import { ref, computed, reactive, Ref, watch } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import { QueryStatus } from '@/enums/QueryStatus';
import Query from '@/core/query/Query';
import useQueryKeyWatcher from '@/vue/query/useQueryKeyWatcher';
import { startTimeout } from '@/support/helpers';

export type QueryCallback<TData> = (...data: any) => Promise<TData>;
export type QueryOptions<TData, TError> = {
    manual: boolean;
    keysNotToWait: string[];
    defaultData: TData | null;
    keepPreviousData: boolean;
    timesToRetryOnError: number;
    keyChangeRefetchWaitTime: number;
    onError: (error: TError) => void;
    timeToWaitBeforeRetryingOnError: number;
    onSuccess: (data: TData | null | undefined) => void;
    onDataReceive: (data: TData | null | undefined) => void;
};

export default function useQuery<TData, TError = any>(
    key: string | Array<string | Ref | { [key: string]: Ref }>,
    callback: QueryCallback<TData> | null = null,
    {
        manual = false,
        onError = () => {},
        keysNotToWait = [],
        defaultData = null,
        onSuccess = () => {},
        keepPreviousData = false,
        timesToRetryOnError = 3,
        onDataReceive = () => {},
        keyChangeRefetchWaitTime = 500,
        timeToWaitBeforeRetryingOnError = 2000,
    }: Partial<QueryOptions<TData, TError>> = {},
) {
    const data: Ref<TData | null> = ref(null);
    const { queryClient } = useQueryClient<TData, TError>();
    const query = reactive({ value: {} }) as { value: Query<TData, TError> };
    const fetchFromCacheOrRefetch = async (callbackVariables: any[] = [], canRefetch = true) => {
        query.value = queryClient.addQuery(key, { data: defaultData }) as any;

        if ((query.value?.isIdle || !query.value?.data) && callback) {
            if (canRefetch) {
                void refetch(callbackVariables);
            }
        } else {
            onDataReceive(query.value?.data);
        }

        return query.value.data;
    };
    const initQuery = () => fetchFromCacheOrRefetch(variables, !manual);
    const { variables } = useQueryKeyWatcher({
        key,
        keysNotToWait,
        callback: initQuery,
        waitTime: keyChangeRefetchWaitTime,
    });
    const fetchData = async (callbackVariables: any[] = [], timesRetried = 0) => {
        if (!callback) {
            return;
        }

        if (query.value?.isFetching && timesRetried === 0) {
            return;
        }

        callbackVariables = callbackVariables.length ? callbackVariables : variables;

        query.value?.update({
            isFetching: true,
        });

        const callbackResult = callback(...callbackVariables);

        // @ts-ignore
        if (!(callbackResult instanceof Promise)) {
            const error = new Error('The provided callback doesn\'t return a promise!');
            query.value?.update({
                error,
                status: QueryStatus.ERROR,
            });
            onError(error as any);

            return;
        }

        try {
            query.value?.update({
                data: await callbackResult,
                status: QueryStatus.SUCCESS,
            });

            onSuccess(query.value?.data);
            onDataReceive(query.value?.data);
        } catch (error) {
            if (timesRetried >= timesToRetryOnError) {
                query.value?.update({
                    error,
                    status: QueryStatus.ERROR,
                });
                onError(error);

                return;
            }

            await startTimeout(timeToWaitBeforeRetryingOnError);

            fetchData(callbackVariables, ++timesRetried);
        } finally {
            query.value?.update({
                isFetching: false,
            });
        }
    };
    const refetch = async (callbackVariables: any[] = []) => {
        if (!keepPreviousData || isEmpty(data.value)) {
            query.value?.update({
                status: QueryStatus.LOADING,
            });
        }

        await fetchData(callbackVariables);
    };
    initQuery();

    watch(query, newQuery => {
            if (!newQuery?.value?.isSuccess) {
                return;
            }

            data.value = newQuery?.value?.data;
        },
        {
            immediate: true,
        });

    return {
        refetch,
        fetchFromCacheOrRefetch,
        updateQueryData: (updateQueryDataCB: (data: TData | null) => TData) => query.value?.updateData(updateQueryDataCB),

        data: computed(() => data.value),
        status: computed(() => query.value?.status),
        error: computed(() => query.value?.error),
        isIdle: computed(() => query.value?.isIdle),
        isError: computed(() => query.value?.isError),
        isLoading: computed(() => query.value?.isLoading),
        isSuccess: computed(() => query.value?.isSuccess),
        isFetching: computed(() => query.value?.isFetching),
    };
}
