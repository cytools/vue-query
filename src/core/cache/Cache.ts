/**
 * External dependencies.
 */
import { ComputedRef } from 'vue-demi';
import { isObject, cloneDeep } from 'lodash';

/**
 * Internal dependencies.
 */

abstract class Cache<TData> {
    protected cloneMethod: CloneFunction<TData> | null = null;

    public abstract put(key: string, data: TData | null): this;

    public abstract get(key: string): ComputedRef<TData | null>;

    public abstract remove(key: string): this;

    public abstract count(): number;

    public abstract clear(): this;

    public setCloneMethod(callback: CloneFunction<TData>) {
        this.cloneMethod = callback;

        return this;
    }

    protected clone(data: TData | null): TData | null {
        if (this.cloneMethod) {
            return this.cloneMethod(data);
        }

        if (Array.isArray(data) || isObject(data)) {
            return cloneDeep(data);
        }

        return data;
    }
}

export type CloneFunction<TData> = (data: TData | null) => TData | null;

export type CacheData<TData> = {
    [key: string]: TData
}

export default Cache;
