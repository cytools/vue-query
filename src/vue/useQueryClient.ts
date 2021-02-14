/**
 * Internal dependencies.
 */
import Query from '@/core/query/Query';
import QueryClient from '@/core/query/QueryClient';
import InMemoryCache from '@/core/cache/InMemoryCache';

let initializedQueryClient: any = null;
export default function useQueryClient<TData = any, TError = any>() {
    initializedQueryClient = initializedQueryClient
        || new QueryClient<TData, TError>({ cache: new InMemoryCache<Query<TData>>() });
    const queryClient: QueryClient<TData, TError> = initializedQueryClient;

    return {
        queryClient,
    };
}
