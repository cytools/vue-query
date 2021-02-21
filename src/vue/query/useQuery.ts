/**
 * External dependencies.
 */
import { computed, reactive, Ref } from 'vue-demi';

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
    key: string | Array<string | Ref>,
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
    const { queryClient } = useQueryClient<TData, TError>();
    const query = reactive({ value: {} }) as { value: Query<TData, TError> };
    const initQuery = () => {
        query.value = queryClient.addQuery(key, { data: defaultData }) as any;

        if (query.value?.isIdle && callback) {
            void refetch();
        } else {
            onDataReceive(query.value?.data);
        }
    };
    const { variables } = useQueryKeyWatcher({
        key,
        keysNotToWait,
        callback: initQuery,
        waitTime: keyChangeRefetchWaitTime,
    });
    const fetchData = async (timesRetried = 0) => {
        if (!callback) {
            return;
        }

        if (query.value?.isFetching && timesRetried === 0) {
            return;
        }

        query.value?.update({
            isFetching: true,
        });

        const callbackResult = callback(...variables);

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

            fetchData(++timesRetried);
        } finally {
            query.value?.update({
                isFetching: false,
            });
        }
    };
    const refetch = async () => {
        if (query.value?.isSuccess || !keepPreviousData) {
            query.value?.update({
                status: QueryStatus.LOADING,
            });
        }

        await fetchData();
    };
    initQuery();

    return {
        refetch: () => refetch(),
        updateQueryData: (updateQueryDataCB: (data: TData | null) => TData) => query.value?.updateData(updateQueryDataCB),

        data: computed(() => query.value?.data),
        status: computed(() => query.value?.status),
        error: computed(() => query.value?.error),
        isIdle: computed(() => query.value?.isIdle),
        isError: computed(() => query.value?.isError),
        isLoading: computed(() => query.value?.isLoading),
        isSuccess: computed(() => query.value?.isSuccess),
    };
}
