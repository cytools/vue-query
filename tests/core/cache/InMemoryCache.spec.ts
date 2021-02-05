/**
 * Internal dependencies.
 */

import InMemoryCache from '@/core/cache/InMemoryCache';

describe('In Memory Cache', () => {
    let cache: InMemoryCache<string>;

    beforeEach(() => {
        cache = new InMemoryCache<string>();
    });

    it('can store data in the cache', () => {
        expect(cache.get('test').value).toBeNull();

        cache.put('test', 'testing');
        expect(cache.get('test').value).toEqual('testing');
    });

    it('can remove from cache', () => {
        cache.put('test', 'testing');
        expect(cache.get('test').value).toEqual('testing');

        cache.remove('test');
        expect(cache.get('test').value).toBeNull();
    });

    it('can clear the whole cache', () => {
        cache.put('test', 'testing');
        expect(cache.get('test').value).toEqual('testing');

        cache.clear();
        expect(cache.get('test').value).toBeNull();
        expect(cache.count()).toEqual(0);
    });

    it('can get the amount of active cache keys used', () => {
        expect(cache.count()).toEqual(0);

        cache.put('test', 'testing');
        expect(cache.count()).toEqual(1);
    });

    it('doesnt return count of keys that have null value', () => {
        cache.put('test', 'testing');
        expect(cache.count()).toEqual(1);

        cache.remove('test');
        expect(cache.count()).toEqual(0);
    });
});
