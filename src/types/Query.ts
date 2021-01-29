/**
 * External dependencies.
 */
import { Ref } from 'vue-demi';

/**
 * Internal dependencies.
 */
import { Query } from '@/interfaces/Query';

export type QueryCache = Ref<{ [key: string]: Query<any> | undefined }>;
