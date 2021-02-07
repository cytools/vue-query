/**
 * External dependencies.
 */
import { ComputedRef } from 'vue-demi';

/**
 * Internal dependencies.
 */

interface Cache<TData> {
    put: (key: string, data: TData | null) => this;
    get: (key: string) => ComputedRef<TData | null>;
    remove: (key: string) => this;
    count: () => number;
    clear: () => this;
}

export type CacheData<TData> = {
    [key: string]: TData
}

export default Cache;
