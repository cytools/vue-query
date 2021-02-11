/**
 * Internal dependencies.
 */
import Query from '@/core/query/Query';
import { QueryStatus } from '@/enums/QueryStatus';

describe('Query', () => {
    it('has initial state', () => {
        const query = new Query();

        expect(query.data).toBeNull();
        expect(query.error).toBeNull();
        expect(query.isIdle).toBeTruthy();
        expect(query.status).toEqual(QueryStatus.IDLE);
    });

    it('can be updated', () => {
        const query = new Query();

        query.update({
            status: QueryStatus.SUCCESS,
        });

        expect(query.isSuccess).toBeTruthy();
        expect(query.status).toEqual(QueryStatus.SUCCESS);
    });

    it('can update the data only', () => {
        const query = new Query<string[]>({ data: ['test'] });

        expect(query.data).toEqual(['test']);

        query.updateData((data) => [...(data || []), 'hey']);

        expect(query.data).toEqual(['test', 'hey']);
    });
});
