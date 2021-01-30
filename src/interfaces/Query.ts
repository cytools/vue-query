/**
 * Internal dependencies.
 */
import { QueryNetworkStatus } from '@/enums/QueryStatus';

export interface Query<T> {
    data: T | null,
    error: any,
    status: QueryNetworkStatus,
}
