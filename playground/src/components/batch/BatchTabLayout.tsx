import { useState } from 'react'
import { BatchModeSelector } from './BatchModeSelector'
import { BatchResultVisual } from './BatchResultVisual'
import { BatchResponseViewer } from './BatchResponseViewer'
import { JobsList } from './JobsList'
import { CredentialsBox } from '../CredentialsBox'
import { CollapsibleCard, Field, Spinner } from '../ui'
import { selectCls, inputCls } from '../../lib/constants'
import { isFilesResponse, type BatchApiResponse, type Job } from '../../lib/batchTypes'
import type { BaseBatchFormState, BatchInputMode, BatchModeDescription, BatchOutputLayout } from './formTypes'

type FormPatch = Partial<Omit<BaseBatchFormState<unknown>, 'config'>>

interface JobMutation {
    mutate: (input: { jobId: string }) => void
    isPending: boolean
}

interface FilesMutation {
    mutate: (input: { jobId: string; next_page_token?: string }) => void
    isPending: boolean
}

export interface BatchTabLayoutProps {
    formId: string
    form: BaseBatchFormState<unknown>
    onUpdate: (patch: FormPatch) => void
    modeDescriptions: Record<BatchInputMode, BatchModeDescription>
    configSection: React.ReactNode
    configTitle: string
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    submitPending: boolean
    detail: BatchApiResponse | null
    statusMutation: JobMutation
    filesMutation: FilesMutation
    loadMoreFilesMutation: FilesMutation
    cancelMutation: JobMutation
    jobsQuery: { data?: { jobs: Job[] }; isFetching: boolean; refetch: () => void }
}

export function BatchTabLayout({
    formId,
    form,
    onUpdate,
    modeDescriptions,
    configSection,
    configTitle,
    onFormSubmit,
    submitPending,
    detail,
    statusMutation,
    filesMutation,
    loadMoreFilesMutation,
    cancelMutation,
    jobsQuery,
}: BatchTabLayoutProps) {
    const [filesJobId, setFilesJobId] = useState<string | null>(null)

    const detailLoading = submitPending
        || statusMutation.isPending
        || filesMutation.isPending
        || cancelMutation.isPending

    const nextCursor = detail && isFilesResponse(detail) ? detail.next_cursor : undefined

    return (
        <div className="lg:grid lg:grid-cols-[5fr_3fr] gap-5">
            <div className="flex flex-col gap-5 min-w-0">
                <form id={formId} onSubmit={onFormSubmit} className="flex flex-col gap-5">

                    <CollapsibleCard title="Input">
                        <div className="flex flex-col gap-4">
                            <BatchModeSelector
                                value={form.inputMode}
                                descriptions={modeDescriptions}
                                onChange={v => {
                                    onUpdate({ inputMode: v })
                                    if (v !== 'PREFIX') onUpdate({ outputLayout: 'PREFIX' as BatchOutputLayout })
                                }}
                            />

                            {form.inputMode !== 'MANIFEST' && (
                                <Field label="S3 URI" hint={form.inputMode === 'SINGLE' ? 's3://bucket/file.ext' : 's3://bucket/prefix/'}>
                                    <input
                                        className={inputCls + ' font-mono text-xs'}
                                        value={form.inputUri}
                                        onChange={e => onUpdate({ inputUri: e.target.value })}
                                        placeholder={form.inputMode === 'SINGLE' ? 's3://my-bucket/file.ext' : 's3://my-bucket/prefix/'}
                                    />
                                </Field>
                            )}

                            {form.inputMode === 'PREFIX' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field label="Include Globs" hint="Comma-separated — **/*.wav, **/*.mp3">
                                        <input className={inputCls + ' font-mono text-xs'} value={form.includeGlobs} onChange={e => onUpdate({ includeGlobs: e.target.value })} placeholder="**/*.wav, **/*.mp3" />
                                    </Field>
                                    <Field label="Exclude Globs" hint="Comma-separated — **/tmp/**, *_draft.*">
                                        <input className={inputCls + ' font-mono text-xs'} value={form.excludeGlobs} onChange={e => onUpdate({ excludeGlobs: e.target.value })} placeholder="**/tmp/**, *_draft.*" />
                                    </Field>
                                </div>
                            )}

                            {form.inputMode === 'MANIFEST' && (
                                <Field label="Manifest URIs" hint="One URI per line. Lines starting with # are ignored.">
                                    <textarea
                                        className={inputCls + ' min-h-32 resize-y font-mono text-xs leading-relaxed'}
                                        value={form.manifest}
                                        onChange={e => onUpdate({ manifest: e.target.value })}
                                        placeholder={'# Public URLs\nhttps://cdn.example.com/file1\nhttps://cdn.example.com/file2\n\n# Private S3 URIs\ns3://my-bucket/file3'}
                                    />
                                </Field>
                            )}

                            <CredentialsBox
                                title="Input AWS Credentials"
                                fromEnv={form.inputAwsFromEnv}
                                onFromEnvChange={v => onUpdate({ inputAwsFromEnv: v })}
                                keyId={form.inputAwsKeyId} onKeyId={v => onUpdate({ inputAwsKeyId: v })}
                                secret={form.inputAwsSecret} onSecret={v => onUpdate({ inputAwsSecret: v })}
                                session={form.inputAwsSession} onSession={v => onUpdate({ inputAwsSession: v })}
                                envNote={form.inputMode === 'MANIFEST' ? 'Not required if all manifest URLs are public https:// links. Enable to use server env AWS_* variables for private S3 access.' : undefined}
                            />
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard title="Output — S3">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Layout" hint="Where output files will be written">
                                    {form.inputMode === 'PREFIX' ? (
                                        <select
                                            className={selectCls}
                                            value={form.outputLayout}
                                            onChange={e => onUpdate({ outputLayout: e.target.value as BatchOutputLayout })}
                                        >
                                            <option value="ADJACENT">ADJACENT — next to input file</option>
                                            <option value="PREFIX">PREFIX — under output URI</option>
                                        </select>
                                    ) : (
                                        <div className={inputCls + ' text-gray-400 select-none'}>PREFIX — under output URI</div>
                                    )}
                                </Field>
                                {(form.outputLayout === 'PREFIX' || form.inputMode !== 'PREFIX') && (
                                    <Field label="S3 URI" hint="Bucket URI for output files">
                                        <input className={inputCls + ' font-mono text-xs'} value={form.outputUri} onChange={e => onUpdate({ outputUri: e.target.value })} placeholder="s3://my-bucket/output/" />
                                    </Field>
                                )}
                            </div>
                            <CredentialsBox
                                title="Output AWS Credentials"
                                fromEnv={form.outputAwsFromEnv}
                                onFromEnvChange={v => onUpdate({ outputAwsFromEnv: v })}
                                keyId={form.outputAwsKeyId} onKeyId={v => onUpdate({ outputAwsKeyId: v })}
                                secret={form.outputAwsSecret} onSecret={v => onUpdate({ outputAwsSecret: v })}
                                session={form.outputAwsSession} onSession={v => onUpdate({ outputAwsSession: v })}
                            />
                        </div>
                    </CollapsibleCard>

                    <CollapsibleCard title={configTitle} defaultOpen={false}>
                        {configSection}
                    </CollapsibleCard>

                    <CollapsibleCard title="Metadata & Notifications" defaultOpen={false}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Reference ID" hint="Optional tracking ID attached to this job (max 256 chars)">
                                <input className={inputCls} value={form.referenceId} onChange={e => onUpdate({ referenceId: e.target.value })} placeholder="job-2025-11" />
                            </Field>
                            <div />
                            <Field label="Webhook URL" hint="Receives POST on every state change">
                                <input className={inputCls} value={form.webhookUrl} onChange={e => onUpdate({ webhookUrl: e.target.value })} placeholder="https://example.com/hooks/service" />
                            </Field>
                            <Field label="Webhook Secret" hint="HMAC secret for payload signature verification">
                                <input className={inputCls + ' font-mono'} type="password" value={form.webhookSecret} onChange={e => onUpdate({ webhookSecret: e.target.value })} placeholder="hmac-secret" />
                            </Field>
                        </div>
                    </CollapsibleCard>
                </form>
            </div>

            <div className="flex flex-col gap-5 lg:sticky lg:top-18 min-w-0">
                <button
                    form={formId}
                    type="submit"
                    disabled={submitPending}
                    className={[
                        'flex items-center gap-2 self-start px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150',
                        submitPending
                            ? 'bg-zoom-blue/50 text-white cursor-not-allowed'
                            : 'bg-zoom-blue hover:bg-zoom-blue-hover active:scale-95 text-white shadow-lg shadow-zoom-blue/25',
                    ].join(' ')}
                >
                    {submitPending && <Spinner />}
                    {submitPending ? 'Submitting…' : '▶ Submit Batch Job'}
                </button>

                <BatchResponseViewer
                    detail={detail}
                    detailLoading={detailLoading}
                    visual={detail && !detailLoading ? <BatchResultVisual data={detail} /> : undefined}
                    onLoadMore={filesJobId && nextCursor
                        ? () => loadMoreFilesMutation.mutate({ jobId: filesJobId, next_page_token: nextCursor })
                        : undefined
                    }
                    loadingMore={loadMoreFilesMutation.isPending}
                />

                <JobsList
                    jobs={jobsQuery.data?.jobs ?? []}
                    loadingJobs={jobsQuery.isFetching}
                    stateFilter={form.stateFilter}
                    onStateFilterChange={v => onUpdate({ stateFilter: v })}
                    onRefresh={() => jobsQuery.refetch()}
                    onAction={(action, jobId) => {
                        if (action === 'files') {
                            setFilesJobId(jobId)
                            filesMutation.mutate({ jobId })
                        } else if (action === 'status') {
                            statusMutation.mutate({ jobId })
                        } else {
                            cancelMutation.mutate({ jobId })
                        }
                    }}
                />
            </div>
        </div>
    )
}
