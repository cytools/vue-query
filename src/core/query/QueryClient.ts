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

    addQuery(key: string, queryData: Partial<QueryData<TData>>) {
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
