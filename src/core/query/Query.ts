/**
 * External dependencies.
 */
import { ref, computed, Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import { QueryStatus } from '@/enums/QueryStatus';
import { QueryData } from '@/interfaces/QueryData';

class Query<TData, TError = any> {
    protected queryData: Ref<QueryData<TData, TError>>;

    constructor({
        data = null,
        error = null,
        status = QueryStatus.IDLE,
    }: Partial<QueryData<TData, TError>> = {}) {
        this.queryData = ref({
            data,
            error,
            status,
        }) as Ref<QueryData<TData, TError>>;
    }

    update(queryData: Partial<QueryData<TData>>): this {
        this.queryData.value = {
            ...this.queryData.value,
            ...queryData,
        };

        return this;
    }

    updateData(callback: (data: TData | null) => TData | null): this {
        return this.update({
            data: callback(this.data.value),
        });
    }

    get data() {
        return computed(() => this.queryData.value.data);
    }

    get status() {
        return computed(() => this.queryData.value.status);
    }

    get error() {
        return computed(() => this.queryData.value.error);
    }

    get isIdle() {
        return computed(() => this.queryData.value.status === QueryStatus.IDLE);
    }

    get isError() {
        return computed(() => this.queryData.value.status === QueryStatus.ERROR);
    }

    get isLoading() {
        return computed(() => this.queryData.value.status === QueryStatus.LOADING);
    }

    get isSuccess() {
        return computed(() => this.queryData.value.status === QueryStatus.SUCCESS);
    }
}

export default Query;
