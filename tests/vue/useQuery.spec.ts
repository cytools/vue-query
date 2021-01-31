/**
 * Internal dependencies.
 */
import useQuery from '@/vue/useQuery';
import useQueryClient from '@/vue/useQueryClient';
import { QueryNetworkStatus } from '@/enums/QueryStatus';
import { startTimeout } from '@/support/helpers';

describe('useQuery', () => {
    beforeEach(() => {
        const { resetCache } = useQueryClient();

        resetCache();
    });

    it('calls the callback immediately', () => {
        const jestMockFn = jest.fn();
        const callback = async () => jestMockFn();
        const { status, isLoading } = useQuery('some-query', callback);

        expect(isLoading.value).toBeTruthy();
        expect(status.value).toEqual(QueryNetworkStatus.LOADING);
        expect(jestMockFn).toHaveBeenCalled();
    });

    it('throws an error if the callback doesnt return a Promise', () => {
        // @ts-ignore
        const { error, status, isError } = useQuery('some-query', () => {});

        expect(isError.value).toBeTruthy();
        expect(status.value).toEqual(QueryNetworkStatus.ERROR);
        expect(error.value).not.toBeNull();
        expect(error.value.message).toEqual('The provided callback doesn\'t return a promise!');
    });

    it('returns the data from the callback', async () => {
        const dataToReturn = ['some-data', 'with-data'];
        const { data, isSuccess, isLoading } = useQuery<string[]>('some-query', async () => dataToReturn);

        expect(isLoading.value).toBeTruthy();
        expect(data.value).toBeNull();

        // wait for the callback promise to execute
        await startTimeout(0);

        expect(isSuccess.value).toBeTruthy();
        expect(data.value).toEqual(dataToReturn);
    });
});
