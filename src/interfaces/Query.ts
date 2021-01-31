/**
 * Internal dependencies.
 */
import { QueryStatus } from '@/enums/QueryStatus';

export interface Query<TData> {
    data: TData | null,
    error: any,
    status: QueryStatus,
}
