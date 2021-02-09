/**
 * External dependencies.
 */
import { computed, reactive } from 'vue-demi';

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
        this.queryData = reactive({ data, error, status }) as QueryData<TData, TError>;
    }

    update(queryData: Partial<QueryData<TData>>): this {
        this.queryData = reactive({
            ...this.queryData,
            ...queryData,
        }) as QueryData<TData, TError>;

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
        return {
            data: computed(() => this.data),
            status: computed(() => this.status),
            error: computed(() => this.error),
            isIdle: computed(() => this.isIdle),
            isError: computed(() => this.isError),
            isLoading: computed(() => this.isLoading),
            isSuccess: computed(() => this.isSuccess),
        };
    }
}

export default Query;
