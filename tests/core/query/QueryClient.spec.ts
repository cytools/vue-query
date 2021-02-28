/**
 * External dependencies.
 */
import { watch } from 'vue-demi';

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

    it('returned query is reactive', (done) => {
        const query = queryClient.addQuery('test', {
            data: 'test',
            error: null,
        });

        expect(query.value?.data).toBe('test');

        watch(query, updatedQuery => {
            expect(updatedQuery?.data).toBe('testing');

            done();
        }, { deep: true });

        query.value?.updateData(() => 'testing');
    });

    it('updates multiple queries that have the key we provided', () => {
        const query = queryClient.addQuery(['test', { page: { value: 1 } }, { test: { value: 3 } }], {
            data: 'test',
        });
        const query2 = queryClient.addQuery(['test', { testing: 3 }], {
            data: 'resting',
        });

        expect(query.value?.data).toEqual('test');
        expect(query2.value?.data).toEqual('resting');

        queryClient.updateQueryDataForQueriesWithStartingKey('test', () => 'hello');

        expect(query.value?.data).toEqual('hello');
        expect(query2.value?.data).toEqual('hello');
    });

    it('updates multiple queries even if the key we provide is all over the place', () => {
        const query = queryClient.addQuery([{ page: { value: 1 } }, { festival: { test: 12 } }], {
            data: 'test',
        });
        const query2 = queryClient.addQuery(['festival', { testing: 3 }], {
            data: 'resting',
        });

        expect(query.value?.data).toEqual('test');
        expect(query2.value?.data).toEqual('resting');

        queryClient.updateQueryDataForQueriesWithStartingKey('festival', () => 'hello');

        expect(query.value?.data).toEqual('hello');
        expect(query2.value?.data).toEqual('hello');
    });
});
