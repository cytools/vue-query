/**
 * External dependencies.
 */
import { computed, reactive } from 'vue-demi';

/**
 * Internal dependencies.
 */
import Cache, { CacheData } from '@/core/cache/Cache';

class InMemoryCache<TData> extends Cache<TData> {
    protected cache: { value: CacheData<TData | null> };

    constructor(initialData: CacheData<TData> = {}) {
        super();

        this.cache = reactive({ value: initialData }) as { value: CacheData<TData> };
    }

    public put(key: string, data: TData | null) {
        this.updateCache(key, data);

        return this;
    }

    public get(key: string) {
        return computed(() => this.cache.value[key] || null);
    }

    public remove(key: string) {
        this.put(key, null);

        return this;
    }

    public count(): number {
        return Object.keys(this.cache.value).reduce((total, key) => this.cache.value[key] ? ++total : total, 0);
    }

    public clear() {
        this.cache.value = {};

        return this;
    }

    protected updateCache(key: string, data: TData | null): void {
        this.cache.value = {
            ...this.cache.value,
            [key]: data,
        };
    }
}

export default InMemoryCache;
