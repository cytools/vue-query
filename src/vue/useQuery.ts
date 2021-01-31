/**
 * External dependencies.
 */
import { computed } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import { QueryNetworkStatus } from '@/enums/QueryStatus';

export type QueryCallback<T> = () => Promise<T>;
export type QueryOptions<T> = {
    onError: (error: any) => void;
    onSuccess: (data: T) => void;
    onDataReceive: (data: T) => void;
    defaultData: T | null;
};

export default function useQuery<T>(
    key: string,
    callback: QueryCallback<T> | null = null,
    {
        onError = () => {},
        onSuccess = () => {},
        onDataReceive = () => {},
        defaultData = null,
    }: Partial<QueryOptions<T>> = {},
) {
    const { addQuery, updateQuery, updateQueryData } = useQueryClient<T>();
    const query = addQuery(key, { data: defaultData });

    const refetch = async () => {
        if (query.value.status === QueryNetworkStatus.LOADING || !callback) {
            return;
        }

        updateQuery(key, {
            status: QueryNetworkStatus.LOADING,
        });

        try {
            const callbackResult = callback();

            // @ts-ignore
            if (!(callbackResult instanceof Promise)) {
                throw new Error('The provided callback doesn\'t return a promise!');
            }

            const updatedQuery = updateQuery(key, {
                data: await callbackResult,
                status: QueryNetworkStatus.SUCCESS,
            });

            onSuccess(updatedQuery.value.data);
            onDataReceive(updatedQuery.value.data);
        } catch (error) {
            updateQuery(key, {
                error,
                status: QueryNetworkStatus.ERROR,
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
        isIdle: computed(() => query.value.status === QueryNetworkStatus.IDLE),
        isError: computed(() => query.value.status === QueryNetworkStatus.ERROR),
        isLoading: computed(() => query.value.status === QueryNetworkStatus.LOADING),
        isSuccess: computed(() => query.value.status === QueryNetworkStatus.SUCCESS),
        updateQueryData: (updateQueryDataCB: (data: T) => T) => updateQueryData(key, updateQueryDataCB),
    };
}
