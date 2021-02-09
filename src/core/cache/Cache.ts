/**
 * External dependencies.
 */
import { ComputedRef } from 'vue-demi';

abstract class Cache<TData> {
    public abstract put(key: string, data: TData | null): this;

    public abstract get(key: string): ComputedRef<TData | null>;

    public abstract remove(key: string): this;

    public abstract count(): number;

    public abstract clear(): this;
}

export type CacheData<TData> = {
    [key: string]: TData
}

export default Cache;
