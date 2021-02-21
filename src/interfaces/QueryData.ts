/**
 * Internal dependencies.
 */
import { QueryStatus } from '@/enums/QueryStatus';

export interface QueryData<TData, TError = any> {
    data: TData | null;
    error: TError | null;
    status: QueryStatus;
    isFetching: boolean;
}
