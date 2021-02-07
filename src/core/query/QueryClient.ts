/**
 * Internal dependencies.
 */
import Cache from '@/core/cache/Cache';
import Query from '@/core/query/Query';
import { QueryData } from '@/interfaces/QueryData';

class QueryClient<TData, TError = any> {
    constructor(
        protected cache: Cache<Query<TData, TError>>,
    ) {}

    addQuery(key: string, query: Partial<QueryData<TData>>) {
        this.cache.put(key, new Query<TData, TError>(query));

        return this;
    }

    removeQuery(key: string) {
        this.cache.remove(key);

        return this;
    }

    getQuery(key: string) {
        return this.cache.get(key);
    }
}

export default QueryClient;
