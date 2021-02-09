/**
 * External dependencies.
 */
import { inject } from 'vue-demi';

/**
 * Internal dependencies.
 */
import Query from '@/core/query/Query';
import QueryClient from '@/core/query/QueryClient';
import InMemoryCache from '@/core/cache/InMemoryCache';

let initializedQueryClient: any = null;
export default function useQueryClient<TData = any, TError = any>() {
    let queryClient: QueryClient<TData, TError> = inject('vue-query-query-client') as QueryClient<TData, TError>;

    if (!queryClient) {
        initializedQueryClient = initializedQueryClient
            || new QueryClient<TData, TError>({ cache: new InMemoryCache<Query<TData>>() });
        queryClient = initializedQueryClient;
    }

    return {
        queryClient,
    };
}
