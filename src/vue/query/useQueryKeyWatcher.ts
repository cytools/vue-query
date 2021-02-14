/**
 * External dependencies.
 */
import { debounce } from 'lodash';
import { isRef, watch, onUnmounted, Ref } from 'vue-demi';
import useCurrentInstance from '@/vue/useCurrentInstance';

/**
 * Internal dependencies.
 */

export interface QueryKeyWatcherOptions {
    key: string | Array<string | Ref>;
    callback: Function;
    waitTime: number;
}

export default function useQueryKeyWatcher({ key, callback, waitTime }: QueryKeyWatcherOptions) {
    let watches: Function[] = [];
    let variables: any[] = [];
    const instance = useCurrentInstance();

    if (Array.isArray(key)) {
        for (const inKey of key) {
            if (isRef(inKey)) {
                const index = variables.push(inKey.value) - 1;

                const onWatch = (newValue: any) => {
                    variables[index] = newValue;

                    callback();
                };

                if (waitTime > 0) {
                    watches.push(watch(inKey, debounce(onWatch, waitTime)));
                } else {
                    watches.push(watch(inKey, onWatch));
                }
            }
        }
    }

    if (instance) {
        onUnmounted(() => {
            watches.forEach((unwatch: Function) => unwatch());
            watches = [];
            variables = [];
        });
    }

    return {
        variables,
    };
}
