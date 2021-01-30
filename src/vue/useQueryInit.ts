/**
 * External dependencies.
 */
import { computed } from 'vue-demi';
import { isObject, defaults } from 'lodash';

/**
 * Internal dependencies.
 */
import { Query } from '@/interfaces/Query';
import { QueryCache } from '@/types/Query';
import { QueryNetworkStatus } from '@/enums/QueryStatus';

export const defaultQueryOptions = {
    data: null,
    error: null,
    status: QueryNetworkStatus.IDLE,
} as const;

const convertToStringKey = (key: string | string[]) => {
    if (Array.isArray(key)) {
        return JSON.stringify(key);
    }

    return key;
};
const cloneQueryData = (data: any) => {
    if (Array.isArray(data)) {
        data = data.map(singleData => cloneQueryData(singleData));
    } else if (isObject(data)) {
        data = Object.keys(data)
            .reduce((object: { [key: string]: any }, key) => {
                object[key] = cloneQueryData(data[key]);

                return object;
            }, {});
    }

    return data;
};
export default function useQueryInit<T>(cache: QueryCache) {
    const getDefaultQuery = () => {
        return computed<Query<T>>(() => defaultQueryOptions);
    };
    const addQuery = (key: string, initialData: Partial<Query<T>> = {}) => {
        key = convertToStringKey(key);

        if (queryExists(key)) {
            return getQuery(key);
        }

        initialData = defaults(initialData, { ...getDefaultQuery().value });

        cache.value = {
            ...cache.value,
            [key]: initialData as Query<T>,
        };

        return getQuery(key);
    };
    const updateQuery = (key: string, queryData: Partial<Query<T>>) => {
        key = convertToStringKey(key);

        if (!queryExists(key)) {
            addQuery(key);
        }

        queryData = defaults(queryData, { ...getQuery(key).value });
        queryData.data = cloneQueryData(queryData.data);

        cache.value = {
            ...cache.value,
            [key]: { ...queryData as Query<T> },
        };

        return getQuery(key);
    };
    const updateQueryData = (key: string, callback: (data: T) => T) => {
        const query = getQuery(key);

        updateQuery(key, {
            ...query.value,
            data: callback(query.value.data),
        });
    };
    const removeQuery = (key: string) => {
        key = convertToStringKey(key);

        cache.value[key] = undefined;
    };
    const getQuery = (key: string) => {
        key = convertToStringKey(key);

        return computed(() => cache.value[key] || getDefaultQuery().value);
    };
    const queryExists = (key: string) => {
        key = convertToStringKey(key);

        return Object.prototype.hasOwnProperty.call(cache.value, key);
    };
    const resetQuery = (key: string) => {
        key = convertToStringKey(key);

        return updateQuery(key, { ...getDefaultQuery().value });
    };

    return {
        addQuery,
        getQuery,
        resetQuery,
        queryExists,
        updateQuery,
        removeQuery,
        updateQueryData,
    };
}
