import { useState } from 'react'
import { trpc } from '../../../lib/trpc'
import { useBatchDetailState } from '../../../components/batch/useBatchDetailState'
import { BatchTabLayout } from '../../../components/batch/BatchTabLayout'
import { buildBatchSubmitPayload, parseManifestEntries } from '../../../components/batch/formUtils'
import { parseCommaSeparated, buildAwsCreds } from '../../../lib/utils'
import { SummarizerConfigForm } from '../components/SummarizerConfigForm'
import { type SummarizerBatchFormState, defaultSummarizerBatch, MODE_DESCRIPTIONS } from '../components/batch/types'

export function BatchTab() {
    const [form, setForm] = useState<SummarizerBatchFormState>(defaultSummarizerBatch)
    const update = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }))

    const utils = trpc.useUtils()
    const batchState = useBatchDetailState(() => { utils.summarizer.batch.list.invalidate() })

    const jobsQuery = trpc.summarizer.batch.list.useQuery({ stateFilter: form.stateFilter || undefined })

    const submitMutation = trpc.summarizer.batch.submit.useMutation({
        onSuccess: batchState.onJobComplete,
        onError: batchState.onMutationError,
    })
    const statusMutation = trpc.summarizer.batch.getStatus.useMutation({
        onMutate: batchState.clearDetail,
        onSuccess: batchState.onDetailSuccess,
        onError: batchState.onMutationError,
    })
    const filesMutation = trpc.summarizer.batch.getFiles.useMutation({
        onMutate: batchState.clearDetail,
        onSuccess: batchState.onDetailSuccess,
        onError: batchState.onMutationError,
    })
    const loadMoreFilesMutation = trpc.summarizer.batch.getFiles.useMutation({
        onSuccess: batchState.onMoreFilesSuccess,
        onError: batchState.onMutationError,
    })
    const cancelMutation = trpc.summarizer.batch.cancel.useMutation({
        onMutate: batchState.clearDetail,
        onSuccess: batchState.onJobComplete,
        onError: batchState.onMutationError,
    })

    return (
        <BatchTabLayout
            formId="summarizer-batch-form"
            form={form}
            onUpdate={update}
            modeDescriptions={MODE_DESCRIPTIONS}
            configTitle="Summarization Config"
            configSection={<SummarizerConfigForm value={form.config} onChange={v => update({ config: v as typeof form.config })} />}
            onFormSubmit={e => {
                e.preventDefault()
                submitMutation.mutate(buildBatchSubmitPayload({
                    form,
                    manifestList: parseManifestEntries(form.manifest),
                    includeGlobs: parseCommaSeparated(form.includeGlobs),
                    excludeGlobs: parseCommaSeparated(form.excludeGlobs),
                    inputAws: buildAwsCreds(form.inputAwsFromEnv, form.inputAwsKeyId, form.inputAwsSecret, form.inputAwsSession),
                    outputAws: buildAwsCreds(form.outputAwsFromEnv, form.outputAwsKeyId, form.outputAwsSecret, form.outputAwsSession),
                }))
            }}
            submitPending={submitMutation.isPending}
            detail={batchState.detail}
            statusMutation={statusMutation}
            filesMutation={filesMutation}
            loadMoreFilesMutation={loadMoreFilesMutation}
            cancelMutation={cancelMutation}
            jobsQuery={jobsQuery}
        />
    )
}
