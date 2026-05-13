export * from '../../../../lib/batchTypes'
export type { BatchApiResponse as TranslatorBatchApiResponse } from '../../../../lib/batchTypes'

import type { TranslatorConfig } from '../../lib/constants'
import {
    defaultBatchFormStateBase,
    type BaseBatchFormState,
    type BatchInputMode,
    type BatchModeDescription,
    type BatchOutputLayout,
} from '../../../../components/batch/formTypes'

export type TranslatorInputMode = BatchInputMode
export type OutputLayout = BatchOutputLayout

export type TranslatorBatchFormState = BaseBatchFormState<TranslatorConfig, OutputLayout>

export const defaultTranslatorBatch: TranslatorBatchFormState = {
    ...defaultBatchFormStateBase,
    includeGlobs: '',
    config: { source_language: 'en-US', target_languages: ['es-ES'] },
}

export const INPUT_MODE_DESCRIPTIONS: Record<TranslatorInputMode, BatchModeDescription> = {
    SINGLE: { title: 'Single file', hint: 'One S3 .txt file' },
    PREFIX: { title: 'S3 directory', hint: 'All .txt files under a prefix' },
    MANIFEST: { title: 'Manifest', hint: 'List of S3 URIs or public URLs' },
}
