/**
 * Internal dependencies.
 */
import useQueryClient from '../../../src/vue/useQueryClient';

describe('useQuery', () => {
    beforeEach(() => {
        const { queryClient } = useQueryClient();

        queryClient.reset();
    });
});
