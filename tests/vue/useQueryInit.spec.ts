/**
 * External dependencies.
 */
import { ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryInit from '@/vue/useQueryInit';
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

        expect(someQuery).toEqual({
            data: null,
            error: null,
            status: QueryNetworkStatus.IDLE,
        });
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
});
