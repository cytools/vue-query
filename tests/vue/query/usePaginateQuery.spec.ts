/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import usePaginateQuery from '@/vue/query/usePaginateQuery';
import { startTimeout } from '../../../src/support/helpers';

describe('useQuery', () => {
    beforeEach(() => {
        const { queryClient } = useQueryClient();

        queryClient.reset();
    });

    it('has properties for pagination', () => {
        const {
            currentPage,
            hasMorePages,
            fetchNextPage,
            fetchPrevPage,
            isPrevButtonActive,
            isNextButtonActive,
            canShowPaginationButtons,
        } = usePaginateQuery<string>(
            'some-paginate-query',
            async () => ({ data: '', hasNextPage: false }),
        );

        expect(hasMorePages.value).toBeFalsy();
        expect(currentPage.value).toEqual(1);
        expect(fetchPrevPage).toBeInstanceOf(Function);
        expect(fetchNextPage).toBeInstanceOf(Function);
        expect(isNextButtonActive.value).toBeFalsy();
        expect(isPrevButtonActive.value).toBeFalsy();
        expect(canShowPaginationButtons.value).toBeFalsy();
    });

    it('it can paginate for next data', async () => {
        const {
            data,
            currentPage,
            hasMorePages,
            fetchNextPage,
            isPrevButtonActive,
            isNextButtonActive,
            canShowPaginationButtons,
        } = usePaginateQuery<string>(
            'some-paginate-query',
            async (page) => {
                return { data: page === 1 ? 'page-1-data' : 'page-2-data', hasNextPage: page === 1 };
            },
        );

        // initially everything is default
        expect(data.value).toBeNull();
        expect(hasMorePages.value).toBeFalsy();
        expect(currentPage.value).toEqual(1);
        expect(isPrevButtonActive.value).toBeFalsy();
        expect(isNextButtonActive.value).toBeFalsy();
        expect(canShowPaginationButtons.value).toBeFalsy();

        await startTimeout(1);

        expect(data.value).toEqual('page-1-data');
        expect(hasMorePages.value).toBeTruthy();
        expect(currentPage.value).toEqual(1);
        expect(isPrevButtonActive.value).toBeFalsy();
        expect(isNextButtonActive.value).toBeTruthy();
        expect(canShowPaginationButtons.value).toBeTruthy();

        fetchNextPage();

        await startTimeout(1);

        expect(data.value).toEqual('page-2-data');
        expect(hasMorePages.value).toBeFalsy();
        expect(currentPage.value).toEqual(2);
        expect(isPrevButtonActive.value).toBeTruthy();
        expect(isNextButtonActive.value).toBeFalsy();
        expect(canShowPaginationButtons.value).toBeTruthy();
    });
});
