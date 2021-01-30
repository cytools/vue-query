/**
 * External dependencies.
 */
import { ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryInit, { defaultQueryOptions } from '@/vue/useQueryInit';
import { QueryCache } from '@/types/Query';
import { QueryNetworkStatus } from '@/enums/QueryStatus';

const cache: QueryCache = ref({});
describe('useQueryInit', () => {
    beforeEach(() => {
        cache.value = {};
    });

    it('can store a query with default options', () => {
        const { addQuery } = useQueryInit<any>(cache);

        addQuery('some-query');

        const someQuery = cache.value['some-query'];

        expect(someQuery).toEqual(defaultQueryOptions);
    });

    it('returns the default options for query if the query does not exist', () => {
        const { getQuery } = useQueryInit<any>(cache);

        expect(getQuery('random').value).toEqual(defaultQueryOptions);
    });

    it('returns the state of the old query if the key is in cache', () => {
        cache.value['some-query'] = {
            data: ['anything'],
            error: null,
            status: QueryNetworkStatus.SUCCESS,
        };
        const { getQuery } = useQueryInit<any>(cache);

        const someQuery = getQuery('some-query').value;

        expect(someQuery).toEqual({
            data: ['anything'],
            error: null,
            status: QueryNetworkStatus.SUCCESS,
        });
    });

    it('can set initial defaults when adding a query', () => {
        const { addQuery, getQuery } = useQueryInit<any>(cache);

        addQuery('some-query', { data: ['test'] });

        expect(getQuery('some-query').value).toEqual({
            ...defaultQueryOptions,
            data: ['test'],
        });
    });
});
