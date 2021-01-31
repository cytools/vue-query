/**
 * External dependencies.
 */
import { ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryInit from '@/vue/useQueryInit';
import { QueryCache } from '@/types/Query';

const cache: QueryCache = ref({});
export default function useQueryClient<TData = any>() {
    const resetCache = () => cache.value = {};

    return {
        resetCache,
        ...useQueryInit<TData>(cache),
    };
}
