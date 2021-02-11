/**
 * External dependencies.
 */
import { get } from 'lodash';
import { getCurrentInstance } from 'vue-demi';

export default function useCurrentInstance() {
    const instance = getCurrentInstance();

    return get(instance, 'proxy', instance);
}
