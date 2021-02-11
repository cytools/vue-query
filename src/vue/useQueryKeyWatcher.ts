/**
 * External dependencies.
 */
import { debounce } from 'lodash';
import { isRef, watch, onUnmounted, Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */

export interface QueryKeyWatcherOptions {
    key: string | Ref[];
    callback: Function;
    waitTime: number;
}

export default function useQueryKeyWatcher({ key, callback, waitTime }: QueryKeyWatcherOptions) {
    let watches: Function[] = [];
    let reactiveVariables: any[] = [];

    if (Array.isArray(key)) {
        for (const inKey of key) {
            if (isRef(inKey)) {
                const index = reactiveVariables.push(inKey.value) - 1;

                const onWatch = (newValue: any) => {
                    reactiveVariables[index] = newValue;

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
    onUnmounted(() => {
        watches.forEach((unwatch: Function) => unwatch());
        watches = [];
        reactiveVariables = [];
    });

    return {
        watches,
        reactiveVariables,
    };
}
