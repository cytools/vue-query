/**
 * External dependencies.
 */
import { isObject, debounce } from 'lodash';
import { isRef, watch, onUnmounted, Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useCurrentInstance from '@/vue/useCurrentInstance';
import { containsAny } from '@/support/helpers';

export interface QueryKeyWatcherOptions {
    key: string | Array<string | Ref | { [key: string]: Ref }>;
    waitTime: number;
    callback: Function;
    keysNotToWait: string[];
}

export default function useQueryKeyWatcher(
    {
        key = '',
        waitTime = 500,
        keysNotToWait = [],
        callback = () => {},
    }: Partial<QueryKeyWatcherOptions>,
) {
    if (!key) {
        throw new Error('No key has been provided!');
    }

    let watches: Function[] = [];
    let variables: any[] = [];
    const instance = useCurrentInstance();

    const initWatchersForReactiveVariables = (keys: any) => {
        if (!Array.isArray(keys)) {
            return;
        }

        const foundKeysInObject: string[] = [];
        const initializedVariableIndexes = [];
        const onWatch = (index: number) => (newValue: any) => {
            variables[index] = newValue;

            callback();
        };

        for (const inKey of keys) {
            if (isRef(inKey)) {
                initializedVariableIndexes.push({
                    index: variables.push(inKey.value) - 1,
                    reactiveValue: inKey,
                });
            } else if (isObject(inKey)) {
                for (const [objectKey, data] of Object.entries(inKey)) {
                    if (!isRef(data)) {
                        initWatchersForReactiveVariables(data);

                        continue;
                    }

                    foundKeysInObject.push(objectKey);
                    initializedVariableIndexes.push({
                        index: variables.push(data.value) - 1,
                        reactiveValue: data,
                    });
                }
            }
        }

        for (const indexData of initializedVariableIndexes) {
            if (waitTime > 0 && !containsAny(keysNotToWait, foundKeysInObject)) {
                watches.push(watch(indexData.reactiveValue, debounce(onWatch(indexData.index), waitTime)));
                continue;
            }

            watches.push(watch(indexData.reactiveValue, onWatch(indexData.index)));
        }
    };
    initWatchersForReactiveVariables(key);

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
