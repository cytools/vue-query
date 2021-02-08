/**
 * External dependencies.
 */
import { computed, ref, Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import Cache, { CacheData } from '@/core/cache/Cache';

class InMemoryCache<TData> extends Cache<TData> {
    protected cache: Ref<CacheData<TData | null>>;

    constructor(initialData: CacheData<TData> = {}) {
        super();

        this.cache = ref(initialData) as Ref<CacheData<TData>>;
    }

    public put(key: string, data: TData | null) {
        this.cache.value[key] = data;

        return this;
    }

    public get(key: string) {
        return computed(() => this.cache.value[key] || null);
    }

    public remove(key: string) {
        this.cache.value[key] = null;

        return this;
    }

    public count(): number {
        return Object.keys(this.cache.value).reduce((total, key) => this.cache.value[key] ? ++total : total, 0);
    }

    public clear() {
        this.cache.value = {};

        return this;
    }
}

export default InMemoryCache;
