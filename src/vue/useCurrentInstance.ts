/**
 * External dependencies.
 */
import { get } from 'lodash';
import { getCurrentInstance } from 'vue-demi';

export default function useCurrentInstance() {
    const instance = getCurrentInstance() as any;

    return get(instance, 'proxy', instance);
}
