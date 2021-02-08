/**
 * Internal dependencies.
 */
import Cache from '@/core/cache/Cache';
import Query from '@/core/query/Query';

export interface QueryClientConfig<TData, TError> {
    cache: Cache<Query<TData, TError>>,
}
