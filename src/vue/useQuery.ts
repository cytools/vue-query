/**
 * External dependencies.
 */
import { computed } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import { QueryStatus } from '@/enums/QueryStatus';

export type QueryCallback<TData> = () => Promise<TData>;
export type QueryOptions<TData> = {
    onError: (error: any) => void;
    onSuccess: (data: TData) => void;
    onDataReceive: (data: TData) => void;
    defaultData: TData | null;
};

export default function useQuery<TData>(
    key: string,
    callback: QueryCallback<TData> | null = null,
    {
        onError = () => {},
        onSuccess = () => {},
        onDataReceive = () => {},
        defaultData = null,
    }: Partial<QueryOptions<TData>> = {},
) {
    const { addQuery, updateQuery, updateQueryData } = useQueryClient<TData>();
    const query = addQuery(key, { data: defaultData });

    const refetch = async () => {
        if (query.value.status === QueryStatus.LOADING || !callback) {
            return;
        }

        updateQuery(key, {
            status: QueryStatus.LOADING,
        });

        try {
            const callbackResult = callback();

            // @ts-ignore
            if (!(callbackResult instanceof Promise)) {
                throw new Error('The provided callback doesn\'t return a promise!');
            }

            const updatedQuery = updateQuery(key, {
                data: await callbackResult,
                status: QueryStatus.SUCCESS,
            });

            onSuccess(updatedQuery.value.data);
            onDataReceive(updatedQuery.value.data);
        } catch (error) {
            updateQuery(key, {
                error,
                status: QueryStatus.ERROR,
            });
            onError(error);
        }
    };

    if (!query.value.data && callback) {
        void refetch();
    } else {
        onDataReceive(query.value.data);
    }

    return {
        refetch,
        data: computed(() => query.value.data),
        error: computed(() => query.value.error),
        status: computed(() => query.value.status),
        isIdle: computed(() => query.value.status === QueryStatus.IDLE),
        isError: computed(() => query.value.status === QueryStatus.ERROR),
        isLoading: computed(() => query.value.status === QueryStatus.LOADING),
        isSuccess: computed(() => query.value.status === QueryStatus.SUCCESS),
        updateQueryData: (updateQueryDataCB: (data: TData) => TData) => updateQueryData(key, updateQueryDataCB),
    };
}
