import { useState } from 'react'
import { trpc } from '../../../lib/trpc'
import { useBatchDetailState } from '../../../components/batch/useBatchDetailState'
import { BatchTabLayout } from '../../../components/batch/BatchTabLayout'
import { buildBatchSubmitPayload, parseManifestEntries } from '../../../components/batch/formUtils'
import { parseCommaSeparated, buildAwsCreds } from '../../../lib/utils'
import { TranslatorConfigForm } from '../components/TranslatorConfigForm'
import { type TranslatorBatchFormState, defaultTranslatorBatch, INPUT_MODE_DESCRIPTIONS } from '../components/batch/types'

export function BatchTab() {
    const [form, setForm] = useState<TranslatorBatchFormState>(defaultTranslatorBatch)
    const update = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }))

    const utils = trpc.useUtils()
    const batchState = useBatchDetailState(() => { utils.translator.batch.list.invalidate() })

    const jobsQuery = trpc.translator.batch.list.useQuery({ stateFilter: form.stateFilter || undefined })

    const submitMutation = trpc.translator.batch.submit.useMutation({
        onSuccess: batchState.onJobComplete,
        onError: batchState.onMutationError,
    })
    const statusMutation = trpc.translator.batch.getStatus.useMutation({
        onMutate: batchState.clearDetail,
        onSuccess: batchState.onDetailSuccess,
        onError: batchState.onMutationError,
    })
    const filesMutation = trpc.translator.batch.getFiles.useMutation({
        onMutate: batchState.clearDetail,
        onSuccess: batchState.onDetailSuccess,
        onError: batchState.onMutationError,
    })
    const loadMoreFilesMutation = trpc.translator.batch.getFiles.useMutation({
        onSuccess: batchState.onMoreFilesSuccess,
        onError: batchState.onMutationError,
    })
    const cancelMutation = trpc.translator.batch.cancel.useMutation({
        onMutate: batchState.clearDetail,
        onSuccess: batchState.onJobComplete,
        onError: batchState.onMutationError,
    })

    return (
        <BatchTabLayout
            formId="translator-batch-form"
            form={form}
            onUpdate={update}
            modeDescriptions={INPUT_MODE_DESCRIPTIONS}
            configTitle="Translator Config"
            configSection={<TranslatorConfigForm value={form.config} onChange={v => update({ config: v })} />}
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
