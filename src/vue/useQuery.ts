/**
 * External dependencies.
 */
import { toRefs } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import { QueryStatus } from '@/enums/QueryStatus';

export type QueryCallback<TData> = () => Promise<TData>;
export type QueryOptions<TData, TError> = {
    onError: (error: TError) => void;
    onSuccess: (data: TData | null | undefined) => void;
    onDataReceive: (data: TData | null | undefined) => void;
    defaultData: TData | null;
};

export default function useQuery<TData, TError = any>(
    key: string,
    callback: QueryCallback<TData> | null = null,
    {
        onError = () => {},
        onSuccess = () => {},
        onDataReceive = () => {},
        defaultData = null,
    }: Partial<QueryOptions<TData, TError>> = {},
) {
    const { queryClient } = useQueryClient<TData, TError>();
    const query = queryClient.addQuery(key, { data: defaultData });

    const refetch = async () => {
        if (query.value?.isLoading || !callback) {
            return;
        }

        query.value?.update({
            status: QueryStatus.LOADING,
        });

        try {
            const callbackResult = callback();

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

    if (!query.value?.data && callback) {
        void refetch();
    } else {
        onDataReceive(query.value?.data);
    }

    return {
        refetch,
        updateQueryData: (updateQueryDataCB: (data: TData | null) => TData) => query.value?.updateData(updateQueryDataCB),

        // spread the composable object so we get autocomplete
        ...query.value?.composableObject,

        // spread the composable object with refs and overwrite the above composableObject
        ...toRefs(query.value?.composableObject || {}),
    };
}
