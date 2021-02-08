/**
 * Internal dependencies.
 */
import { QueryStatus } from '@/enums/QueryStatus';
import { QueryData } from '@/interfaces/QueryData';

class Query<TData, TError = any> {
    protected queryData: QueryData<TData, TError>;

    constructor({
        data = null,
        error = null,
        status = QueryStatus.IDLE,
    }: Partial<QueryData<TData, TError>> = {}) {
        this.queryData = { data, error, status };
    }

    update(queryData: Partial<QueryData<TData>>): this {
        this.queryData = {
            ...this.queryData,
            ...queryData,
        };

        return this;
    }

    updateData(callback: (data: TData | null) => TData | null): this {
        return this.update({
            data: callback(this.data),
        });
    }

    get data() {
        return this.queryData.data;
    }

    get status() {
        return this.queryData.status;
    }

    get error() {
        return this.queryData.error;
    }

    get isIdle() {
        return this.queryData.status === QueryStatus.IDLE;
    }

    get isError() {
        return this.queryData.status === QueryStatus.ERROR;
    }

    get isLoading() {
        return this.queryData.status === QueryStatus.LOADING;
    }

    get isSuccess() {
        return this.queryData.status === QueryStatus.SUCCESS;
    }

    get composableObject() {
        const {
            data,
            status,
            error,
            isIdle,
            isError,
            isLoading,
            isSuccess,
        } = this;

        return {
            data,
            status,
            error,
            isIdle,
            isError,
            isLoading,
            isSuccess,
        };
    }
}

export default Query;
