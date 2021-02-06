/**
 * External dependencies.
 */
import { Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import { QueryData } from '@/interfaces/QueryData';

export type QueryCache = Ref<{ [key: string]: QueryData<any> | undefined }>;
