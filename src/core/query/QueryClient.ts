/**
 * Internal dependencies.
 */
import Cache from '@/core/cache/Cache';
import Query from '@/core/query/Query';
import { QueryData } from '@/interfaces/QueryData';
import { QueryClientConfig } from '@/interfaces/QueryClientConfig';

class QueryClient<TData, TError = any> {
    protected cache: Cache<Query<TData, TError>>;

    constructor(config: QueryClientConfig<TData, TError>) {
        this.cache = config.cache;
    }

    addQuery(key: string, queryData: Partial<QueryData<TData, TError>>) {
        const query = this.getQuery(key);

        if (query.value) {
            return query;
        }

        this.cache.put(key, new Query<TData, TError>(queryData));

        return this.getQuery(key);
    }

    removeQuery(key: string) {
        this.cache.remove(key);

        return this;
    }

    getQuery(key: string) {
        return this.cache.get(key);
    }

    reset() {
        return this.cache.clear();
    }
}

export default QueryClient;
