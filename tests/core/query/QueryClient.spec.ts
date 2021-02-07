/**
 * Internal dependencies.
 */
import Query from '@/core/query/Query';
import QueryClient from '@/core/query/QueryClient';
import InMemoryCache from '@/core/cache/InMemoryCache';

describe('Query Client', () => {
    let queryClient: QueryClient<string>;

    beforeEach(() => {
        queryClient = new QueryClient(new InMemoryCache<Query<string>>());
    });

    it('can add a query to the cache', () => {
        const query = queryClient.getQuery('test');

        expect(query.value).toBeNull();

        queryClient.addQuery('test', {
            data: 'test',
            error: null,
        });

        expect(query.value).not.toBeNull();
    });

    it('can remove a query from the cache', () => {
        queryClient.addQuery('test', {
            data: 'test',
            error: null,
        });

        const query = queryClient.getQuery('test');

        expect(query.value).not.toBeNull();

        queryClient.removeQuery('test');

        expect(query.value).toBeNull();
    });
});
