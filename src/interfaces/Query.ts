/**
 * Internal dependencies.
 */
import { QueryNetworkStatus } from '@/enums/QueryStatus';

export interface Query<TData> {
    data: TData | null,
    error: any,
    status: QueryNetworkStatus,
}
