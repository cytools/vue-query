/**
 * Internal dependencies.
 */

import useQuery from '@/vue/useQuery';
import useQueryClient from '@/vue/useQueryClient';
import { QueryNetworkStatus } from '@/enums/QueryStatus';

describe('useQuery', () => {
    beforeEach(() => {
        const { resetCache } = useQueryClient();

        resetCache();
    });

    it('it calls the callback immediately', () => {
        const jestMockFn = jest.fn();
        const callback = async () => jestMockFn();
        const { status, isLoading } = useQuery('some-query', callback);

        expect(isLoading.value).toBeTruthy();
        expect(status.value).toEqual(QueryNetworkStatus.LOADING);
        expect(jestMockFn).toHaveBeenCalled();
    });

    it('it throws an error if the callback doesnt return a Promise', () => {
        // @ts-ignore
        const { error, status, isError } = useQuery('some-query', () => {});

        expect(isError.value).toBeTruthy();
        expect(status.value).toEqual(QueryNetworkStatus.ERROR);
        expect(error.value).not.toBeNull();
        expect(error.value.message).toEqual('The provided callback doesn\'t return a promise!');
    });
});
