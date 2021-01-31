/**
 * Internal dependencies.
 */
import useQueryClient from '@/vue/useQueryClient';
import useMutation from '@/vue/useMutation';

describe('useMutation', () => {
    beforeEach(() => {
        const { resetCache } = useQueryClient();

        resetCache();
    });

    it('runs mutation callback when calling mutate', async () => {
        const mockFn = jest.fn();
        const callback = async () => mockFn();
        const { mutate } = useMutation(callback);

        await mutate();

        expect(mockFn).toHaveBeenCalled();
    });
});
