/**
 * Internal dependencies.
 */

import Query from '@/core/query/Query';
import { QueryStatus } from '@/enums/QueryStatus';

describe('Query', () => {
    it('has initial state', () => {
        const query = new Query();

        expect(query.data.value).toBeNull();
        expect(query.error.value).toBeNull();
        expect(query.isIdle.value).toBeTruthy();
    });

    it('can be updated', () => {
        const query = new Query();

        query.update({
            status: QueryStatus.SUCCESS,
        });

        expect(query.isSuccess).toBeTruthy();
    });
});
