/**
 * External dependencies.
 */
import { computed } from 'vue-demi';

/**
 * Internal dependencies.
 */
import Cache from '@/core/cache/Cache';
import Query from '@/core/query/Query';
import { QueryData } from '@/interfaces/QueryData';
import { QueryClientConfig } from '@/interfaces/QueryClientConfig';
import { ComputedRef } from '@vue/composition-api';

export type QueryKey = string | any[];

class QueryClient<TData, TError = any> {
    protected cache: Cache<Query<TData, TError>>;

    constructor(config: QueryClientConfig<TData, TError>) {
        this.cache = config.cache;
    }

    addQuery(key: QueryKey, queryData: Partial<QueryData<TData, TError>>) {
        key = this.convertKey(key);

        const query = this.getQuery(key);

        if (query.value) {
            return query;
        }

        this.cache.put(key, new Query<TData, TError>(queryData));

        return this.getQuery(key);
    }

    removeQuery(key: QueryKey) {
        this.cache.remove(this.convertKey(key));

        return this;
    }

    getQuery(key: QueryKey) {
        return this.cache.get(this.convertKey(key));
    }

    getQueriesWithStartingKey(key: string | any[]): ComputedRef<({ key: string, query: Query<TData, TError> })[]> {
        const convertedKey = this.convertKey(key);

        return computed(() => {
            return this.cache.getCacheKeys()
                .map(queryCacheKey => {
                    if (queryCacheKey.includes(convertedKey)) {
                        return { key: queryCacheKey, query: this.getQuery(queryCacheKey).value };
                    }

                    return null;
                })
                .filter(data => data);
        }) as ComputedRef<({ key: string, query: Query<TData, TError> })[]>;
    }

    updateQueryDataForQueriesWithStartingKey(key: QueryKey, callback: CallableFunction) {
        this.getQueriesWithStartingKey(key)
            .value
            .forEach(query => query.query.updateData(callback as any));
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
