/**
 * External dependencies.
 */
import { ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQuery from '@/vue/query/useQuery';
import { startTimeout } from '@/support/helpers';
import useQueryClient from '@/vue/useQueryClient';
import { QueryStatus } from '@/enums/QueryStatus';

describe('useQuery', () => {
    beforeEach(() => {
        const { queryClient } = useQueryClient();

        queryClient.reset();
    });

    it('calls the callback immediately', () => {
        const jestMockFn = jest.fn();
        const callback = async () => jestMockFn();
        const { status, isLoading } = useQuery('some-query', callback);

        expect(isLoading.value).toBeTruthy();
        expect(status.value).toEqual(QueryStatus.LOADING);
        expect(jestMockFn).toHaveBeenCalled();
    });

    it('uses the cache instead of calling the callback function', async () => {
        const dataToReturn = ['some-data'];
        useQuery('some-query', async () => dataToReturn);

        await startTimeout(0);

        const jestMockFn = jest.fn();
        const callback = async () => jestMockFn();
        const { data } = useQuery('some-query', callback);

        await startTimeout(0);

        expect(data.value).toEqual(dataToReturn);
        expect(jestMockFn).not.toHaveBeenCalled();
    });

    it('can refetch the data', async () => {
        useQuery('some-query', async () => ['test']);

        await startTimeout(0);

        const jestMockFn = jest.fn();
        const callback = async () => jestMockFn();
        const { refetch } = useQuery('some-query', callback);

        await startTimeout(0);

        expect(jestMockFn).not.toHaveBeenCalled();

        await refetch();

        expect(jestMockFn).toHaveBeenCalled();
    });

    it('throws an error if the callback doesnt return a Promise', () => {
        // @ts-ignore
        const { error, status, isError } = useQuery('some-query', () => {});

        expect(isError.value).toBeTruthy();
        expect(status.value).toEqual(QueryStatus.ERROR);
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

    it('returns the data from a cached query', () => {
        const { queryClient } = useQueryClient<string>();

        queryClient.addQuery('some-query', {
            data: 'test',
        });

        const { data } = useQuery('some-query');

        expect(data.value).toEqual('test');
    });

    it('returns multiple useful properties', () => {
        const query = useQuery('something');

        expect(query.data.value).toEqual(null);
        expect(query.error.value).toEqual(null);
        expect(query.status.value).toEqual(QueryStatus.IDLE);
        expect(query.isIdle.value).toBeTruthy();
        expect(query.isLoading.value).toBeFalsy();
        expect(query.isSuccess.value).toBeFalsy();
        expect(query.isError.value).toBeFalsy();
    });

    it('returns another query when the key changes', async () => {
        const queryId = ref(1);
        const { data, isLoading } = useQuery<string[]>(
            ['some-query', queryId],
            async (id) => {
                if (id === 2) {
                    return ['id-2'];
                }

                return ['id-1'];
            },
            {
                keyChangeRefetchWaitTime: 0,
            },
        );

        expect(isLoading.value).toBeTruthy();

        await startTimeout(0);

        expect(data.value).toEqual(['id-1']);

        queryId.value = 2;

        await startTimeout(0);

        expect(data.value).toEqual(['id-2']);
    });
});
