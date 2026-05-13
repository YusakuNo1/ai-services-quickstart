export * from '../../../../lib/batchTypes'
export type { BatchApiResponse as SummarizerBatchApiResponse } from '../../../../lib/batchTypes'

import { DEFAULT_TRANSCRIPT_GLOB, defaultBatchSummarizerConfig, type BatchSummarizerConfig } from '../../lib/constants'
import {
    defaultBatchFormStateBase,
    type BaseBatchFormState,
    type BatchInputMode,
    type BatchModeDescription,
    type BatchOutputLayout,
} from '../../../../components/batch/formTypes'

export type InputMode = BatchInputMode
export type OutputLayout = BatchOutputLayout

export type SummarizerBatchFormState = BaseBatchFormState<BatchSummarizerConfig, OutputLayout>

export const defaultSummarizerBatch: SummarizerBatchFormState = {
    ...defaultBatchFormStateBase,
    includeGlobs: DEFAULT_TRANSCRIPT_GLOB,
    config: defaultBatchSummarizerConfig,
}

export const MODE_DESCRIPTIONS: Record<InputMode, BatchModeDescription> = {
    SINGLE: { title: 'Single file', hint: 'One transcript file in storage' },
    PREFIX: { title: 'Prefix', hint: 'All transcript files under a storage prefix' },
    MANIFEST: { title: 'Manifest', hint: 'List of transcript URIs or public URLs' },
}
