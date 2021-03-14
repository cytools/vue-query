/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import useInfiniteQuery from '@/vue/query/useInfiniteQuery';
import { startTimeout } from '@/support/helpers';

describe('useQuery', () => {
    beforeEach(() => {
        const { queryClient } = useQueryClient();

        queryClient.reset();
    });

    it('contains both the first and the next paginated data', async () => {
        const {
            data,
            fetchMore,
            canFetchMore,
        } = useInfiniteQuery('hackera', async (page) => {
            if (page === 1) {
                return {
                    data: ['hacker'],
                    hasNextPage: true,
                };
            }

            return {
                data: ['hacker2'],
                hasNextPage: false,
            };
        });

        expect(data.value).toEqual([]);

        fetchMore();
        await startTimeout(1);

        expect(data.value).toEqual(['hacker']);
        expect(canFetchMore.value).toBeTruthy();

        fetchMore();
        await startTimeout(1);

        expect(data.value).toEqual(['hacker', 'hacker2']);
        expect(canFetchMore.value).toBeFalsy();

        fetchMore();
        await startTimeout(1);

        expect(data.value).toEqual(['hacker', 'hacker2']);
        expect(canFetchMore.value).toBeFalsy();
    });
});
