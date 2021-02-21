/**
 * External dependencies.
 */
import { reactive } from 'vue-demi';

/**
 * Internal dependencies.
 */
import { QueryStatus } from '@/enums/QueryStatus';
import { QueryData } from '@/interfaces/QueryData';

class Query<TData, TError = any> {
    protected queryData: { value: QueryData<TData, TError> };

    constructor({
        data = null,
        error = null,
        isFetching = false,
        status = QueryStatus.IDLE,
    }: Partial<QueryData<TData, TError>> = {}) {
        this.queryData = reactive({ value: { data, error, status, isFetching } }) as { value: QueryData<TData, TError> };
    }

    update(queryData: Partial<QueryData<TData>>): this {
        this.queryData.value = {
            ...this.queryData.value,
            ...queryData,
        } as QueryData<TData, TError>;

        return this;
    }

    updateData(callback: (data: TData | null) => TData | null): this {
        return this.update({
            data: callback(this.data),
        });
    }

    get data() {
        return this.queryData.value.data;
    }

    get status() {
        return this.queryData.value.status;
    }

    get error() {
        return this.queryData.value.error;
    }

    get isIdle() {
        return this.queryData.value.status === QueryStatus.IDLE;
    }

    get isError() {
        return this.queryData.value.status === QueryStatus.ERROR;
    }

    get isLoading() {
        return this.queryData.value.status === QueryStatus.LOADING;
    }

    get isSuccess() {
        return this.queryData.value.status === QueryStatus.SUCCESS || this.queryData.value.data;
    }

    get isFetching() {
        return this.queryData.value.isFetching;
    }
}

export default Query;
