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

export type QueryCallback<TData> = (...data: any) => Promise<TData>;
export type QueryOptions<TData, TError> = {
    onError: (error: TError) => void;
    onSuccess: (data: TData | null | undefined) => void;
    onDataReceive: (data: TData | null | undefined) => void;
    defaultData: TData | null;
    keyChangeRefetchWaitTime: number;
};

export default function useQuery<TData, TError = any>(
    key: string | Array<string | Ref>,
    callback: QueryCallback<TData> | null = null,
    {
        onError = () => {},
        onSuccess = () => {},
        onDataReceive = () => {},
        defaultData = null,
        keyChangeRefetchWaitTime = 500,
    }: Partial<QueryOptions<TData, TError>> = {},
) {
    const { queryClient } = useQueryClient<TData, TError>();
    const query = reactive({ value: {} }) as { value: Query<TData, TError> };
    const initQuery = () => {
        query.value = queryClient.addQuery(key, { data: defaultData }) as any;

        if (!query.value?.data && callback) {
            void refetch();
        } else {
            onDataReceive(query.value?.data);
        }
    };
    const { variables } = useQueryKeyWatcher({
        key,
        callback: initQuery,
        waitTime: keyChangeRefetchWaitTime,
    });
    const refetch = async () => {
        if (query.value?.isLoading || !callback) {
            return;
        }

        query.value?.update({
            status: QueryStatus.LOADING,
        });

        try {
            const callbackResult = callback(...variables);

            // @ts-ignore
            if (!(callbackResult instanceof Promise)) {
                throw new Error('The provided callback doesn\'t return a promise!');
            }

            query.value?.update({
                data: await callbackResult,
                status: QueryStatus.SUCCESS,
            });

            onSuccess(query.value?.data);
            onDataReceive(query.value?.data);
        } catch (error) {
            query.value?.update({
                error,
                status: QueryStatus.ERROR,
            });
            onError(error);
        }
    };
    initQuery();

    return {
        refetch,
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
