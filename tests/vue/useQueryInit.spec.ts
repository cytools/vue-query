/**
 * External dependencies.
 */
import { ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import { QueryCache } from '@/types/Query';
import { QueryStatus } from '@/enums/QueryStatus';
import useQueryInit, { defaultQueryOptions } from '@/vue/useQueryInit';

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
        const queryData = {
            data: ['anything'],
            error: null,
            status: QueryStatus.SUCCESS,
        };
        cache.value['some-query'] = queryData;

        const { getQuery } = useQueryInit<any>(cache);
        const someQuery = getQuery('some-query').value;

        expect(someQuery).toEqual(queryData);
    });

    it('can set initial defaults when adding a query', () => {
        const { addQuery, getQuery } = useQueryInit<any>(cache);

        addQuery('some-query', { data: ['test'] });

        expect(getQuery('some-query').value).toEqual({
            ...defaultQueryOptions,
            data: ['test'],
        });
    });

    it('automatically adds a query to the cache when we update a query that doesn\'t exist yet', () => {
        expect(cache.value['some-query']).toBeUndefined();

        const { updateQuery } = useQueryInit<any>(cache);
        const dataToUpdateQueryWith = {
            data: 'testing',
            error: null,
            status: QueryStatus.LOADING,
        };
        updateQuery('some-query', dataToUpdateQueryWith);

        expect(cache.value['some-query']).toEqual(dataToUpdateQueryWith);
    });

    it('can update query data', () => {
        const { updateQueryData, getQuery } = useQueryInit<any>(cache);

        updateQueryData('some-query', () => (['test2']));

        expect(getQuery('some-query').value).toEqual({
            ...defaultQueryOptions,
            data: ['test2'],
        });
    });

    it('can reset query', () => {
        const queryData = {
            data: ['anything'],
            error: null,
            status: QueryStatus.SUCCESS,
        };
        cache.value['some-query'] = queryData;

        const { getQuery, resetQuery } = useQueryInit<any>(cache);

        expect(getQuery('some-query').value).toEqual(queryData);

        resetQuery('some-query');

        expect(getQuery('some-query').value).toEqual(defaultQueryOptions);
    });

    it('can remove query from cache', () => {
        cache.value['some-query'] = defaultQueryOptions;

        const { removeQuery } = useQueryInit<any>(cache);

        removeQuery('some-query');

        expect(cache.value['some-query']).toBeUndefined();
    });
});
