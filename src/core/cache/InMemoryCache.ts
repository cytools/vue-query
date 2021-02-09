/**
 * External dependencies.
 */
import { computed, reactive } from 'vue-demi';

/**
 * Internal dependencies.
 */
import Cache, { CacheData } from '@/core/cache/Cache';

class InMemoryCache<TData> extends Cache<TData> {
    protected cache: CacheData<TData | null>;

    constructor(initialData: CacheData<TData> = {}) {
        super();

        this.cache = reactive(initialData) as CacheData<TData>;
    }

    public put(key: string, data: TData | null) {
        this.cache[key] = data;

        return this;
    }

    public get(key: string) {
        return computed(() => this.cache[key] || null);
    }

    public remove(key: string) {
        this.cache[key] = null;

        return this;
    }

    public count(): number {
        return Object.keys(this.cache).reduce((total, key) => this.cache[key] ? ++total : total, 0);
    }

    public clear() {
        this.cache = reactive({});

        return this;
    }
}

export default InMemoryCache;
