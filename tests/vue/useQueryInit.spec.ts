/**
 * External dependencies.
 */
import { ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import useQueryInit from '@/vue/useQueryInit';

describe('useQueryInit', () => {
    it('stores queries', () => {
        const { addQuery } = useQueryInit<any>(ref({}));

        addQuery('t');
    });
});
