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

    addQuery(key: string | any[], queryData: Partial<QueryData<TData, TError>>) {
        key = this.convertKey(key);

        const query = this.getQuery(key);

        if (query.value) {
            return query;
        }

        this.cache.put(key, new Query<TData, TError>(queryData));

        return this.getQuery(key);
    }

    removeQuery(key: string | any[]) {
        this.cache.remove(this.convertKey(key));

        return this;
    }

    getQuery(key: string | any[]) {
        return this.cache.get(this.convertKey(key));
    }

    reset() {
        return this.cache.clear();
    }

    protected convertKey(key: string | any[]): string {
        if (Array.isArray(key)) {
            return JSON.stringify(key);
        }

        return key;
    }
}

export default QueryClient;
