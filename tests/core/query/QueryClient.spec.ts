/**
 * Internal dependencies.
 */
import Query from '@/core/query/Query';
import QueryClient from '@/core/query/QueryClient';
import InMemoryCache from '@/core/cache/InMemoryCache';

describe('Query Client', () => {
    let queryClient: QueryClient<string>;

    beforeEach(() => {
        queryClient = new QueryClient({ cache: new InMemoryCache<Query<string>>() });
    });

    it('can add a query to the cache', () => {
        const query = queryClient.getQuery('test');

        expect(query.value).toBeNull();

        queryClient.addQuery('test', {
            data: 'test',
            error: null,
        });

        expect(query.value).not.toBeNull();
        expect(query.value?.data).toEqual('test');
        expect(query.value?.error).toBeNull();
    });

    it('returns the query from cache if found in cache', () => {
        queryClient.addQuery('test', {
            data: 'test',
            error: null,
        });

        const query = queryClient.addQuery('test', {
            data: 'hacker',
        });

        expect(query.value).not.toBeNull();
        expect(query.value?.data).toEqual('test');
        expect(query.value?.error).toBeNull();
    });

    it('can remove a query from the cache', () => {
        queryClient.addQuery('test', {
            data: 'test',
            error: null,
        });

        const query = queryClient.getQuery('test');

        expect(query.value).not.toBeNull();
        expect(query.value?.data).toEqual('test');
        expect(query.value?.error).toBeNull();

        queryClient.removeQuery('test');

        expect(query.value).toBeNull();
    });
});
