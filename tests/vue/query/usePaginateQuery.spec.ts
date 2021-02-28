/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import usePaginateQuery from '@/vue/query/usePaginateQuery';
import { startTimeout } from '@/support/helpers';

const basePaginationTest = async () => {
    const {
        data,
        currentPage,
        hasMorePages,
        fetchNextPage,
        fetchPrevPage,
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

    await fetchNextPage();

    expect(data.value).toEqual('page-2-data');
    expect(hasMorePages.value).toBeFalsy();
    expect(currentPage.value).toEqual(2);
    expect(isPrevButtonActive.value).toBeTruthy();
    expect(isNextButtonActive.value).toBeFalsy();
    expect(canShowPaginationButtons.value).toBeTruthy();

    return {
        data,
        currentPage,
        hasMorePages,
        fetchNextPage,
        fetchPrevPage,
        isPrevButtonActive,
        isNextButtonActive,
        canShowPaginationButtons,
    };
};

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

    it('can paginate for next data', basePaginationTest);

    it('can fetch page backwards', async () => {
        const {
            data,
            currentPage,
            hasMorePages,
            fetchPrevPage,
            isPrevButtonActive,
            isNextButtonActive,
            canShowPaginationButtons,
        } = await basePaginationTest();

        await fetchPrevPage();

        expect(data.value).toEqual('page-1-data');
        expect(hasMorePages.value).toBeTruthy();
        expect(currentPage.value).toEqual(1);
        expect(isPrevButtonActive.value).toBeFalsy();
        expect(isNextButtonActive.value).toBeTruthy();
        expect(canShowPaginationButtons.value).toBeTruthy();
    });
});
