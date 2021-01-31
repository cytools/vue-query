/**
 * External dependencies.
 */

import { computed, ref, Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import { MutationStatus } from '@/enums/MutationStatus';

export type MutationCallback<TData, TVariables> = (variables?: TVariables) => Promise<TData>;
export type MutationOptions<TData, TVariables> = {
    onMutate: (variables?: TVariables) => Promise<TData | null>;
    onError: (error: any, variables?: TVariables, context?: any) => void;
    onSuccess: (result: TData, variables?: TVariables, context?: any) => void;
};

/* eslint-disable */
export default function useMutation<TData = any, TVariables = undefined>(
    callback: MutationCallback<TData, TVariables>,
    {
        onError = () => null,
        onSuccess = () => null,
        onMutate = async () => null,
    }: Partial<MutationOptions<TData, TVariables>> = {},
) {
    const data: Ref<TData | null> = ref(null);
    const error = ref(null);
    const status = ref(MutationStatus.IDLE);
    const context: Ref<TData | null> = ref(null);
    const mutationResultReturn = () => ({
        data: computed(() => data.value),
        error: computed(() => error.value),
        isIdle: computed(() => status.value === MutationStatus.IDLE),
        isError: computed(() => status.value === MutationStatus.ERROR),
        isSuccess: computed(() => status.value === MutationStatus.SUCCESS),
        isLoading: computed(() => status.value === MutationStatus.LOADING),
    });
    const mutate = async (variables?: TVariables) => {
        if (status.value === MutationStatus.LOADING) {
            return;
        }

        error.value = null;
        status.value = MutationStatus.LOADING;

        try {
            context.value = await onMutate(variables);

            if (context.value) {
                data.value = context.value;
            }

            const callbackResult = callback(variables);

            // @ts-ignore
            if (!(callbackResult instanceof Promise)) {
                throw new Error('The provided callback doesn\'t return a promise!');
            }

            data.value = await callbackResult;
            status.value = MutationStatus.SUCCESS;

            onSuccess(data.value, variables, context.value);
        } catch (e) {
            error.value = e;
            status.value = MutationStatus.ERROR;
            onError(e, variables, context.value);
        }

        return mutationResultReturn();
    };

    return {
        mutate,
        status: computed(() => status.value),
        ...mutationResultReturn(),
    };
}
