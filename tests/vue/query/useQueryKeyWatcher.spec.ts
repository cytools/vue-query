/**
 * External dependencies.
 */
import { ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryKeyWatcher from '@/vue/query/useQueryKeyWatcher';
import { startTimeout } from '@/support/helpers';

describe('useQueryKeyWatcher', () => {
    it('returns empty variables list if the key is just a string', () => {
        const { variables } = useQueryKeyWatcher({
            key: 'test',
            callback: () => {},
            waitTime: 0,
        });

        expect(variables).toEqual([]);
    });

    it
        .each(['data', { someData: 'test' }, ['data']])
        ('returns the value of the ref as a variable', (data) => {
            const someKey = ref(data);
            const { variables } = useQueryKeyWatcher({
                key: [someKey],
                callback: () => {},
                waitTime: 0,
            });

            expect(variables).toEqual([data]);
        });

    it('watches for changes in the ref and updates the variables', async () => {
        const someKey = ref('something');
        const { variables } = useQueryKeyWatcher({
            key: [someKey],
            callback: () => {},
            waitTime: 0,
        });

        expect(variables).toEqual(['something']);

        someKey.value = 'test';

        await startTimeout(0);

        expect(variables).toEqual(['test']);
    });

    it('watches for changes in the ref and updates the variables for a given time', async () => {
        const someKey = ref('something');
        const { variables } = useQueryKeyWatcher({
            key: [someKey],
            callback: () => {},
            waitTime: 30,
        });

        expect(variables).toEqual(['something']);

        someKey.value = 'test';

        // wait for the first 25ms
        // and check if we are still with something
        await startTimeout(25);

        expect(variables).toEqual(['something']);

        await startTimeout(5);

        expect(variables).toEqual(['test']);
    });

    it('calls the callback if the key changes', async () => {
        const someKey = ref('something');
        const mockFn = jest.fn();
        useQueryKeyWatcher({
            key: [someKey],
            callback: mockFn,
            waitTime: 0,
        });

        expect(mockFn).not.toHaveBeenCalled();

        someKey.value = 'changed';

        await startTimeout(0);

        expect(mockFn).toHaveBeenCalled();
    });
});