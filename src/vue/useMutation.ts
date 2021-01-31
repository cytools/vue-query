/**
 * External dependencies.
 */

import { computed, ref, Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import { MutationStatus } from '@/enums/MutationStatus';

export type MutationCallback<TData> = (variables: any) => Promise<TData>;
export type MutationOptions<TData> = {
    onMutate: (varaibles: any) => Promise<TData | null>;
    onError: (error: any, variables: any, context: any) => void;
    onSuccess: (result: TData, variables: any, context: any) => void;
};

/* eslint-disable */
export default function useMutation<TData>(
    callback: MutationCallback<TData>,
    {
        onMutate = async () => null,
        onError = (error, variables, context) => null,
        onSuccess = (result, variables, context) => null,
    }: Partial<MutationOptions<TData>> = {},
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
    const mutate = async (variables: any) => {
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

            data.value = await callback(variables);
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
