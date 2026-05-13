export type ApiError = { code?: string; message?: string; details?: unknown } | null
export type ErrorResponse = { error: string | { code?: string; message?: string } }

export type JobFile = {
    file_id: string
    input_uri: string
    output_uri: string
    state: string
    duration_sec?: number
    error?: ApiError
}

export type FilesResponse = {
    files: JobFile[]
    next_cursor?: string
}

// Field names match the actual Zoom API response (total_files, not total)
export type JobStats = {
    total_files?: number
    succeeded?: number
    failed?: number
    processing?: number
    queued?: number
    skipped?: number
    canceled?: number
    [key: string]: number | undefined
}

export type JobInput = {
    mode: string
    source?: string | null
    uri?: string | null
    manifest?: string[] | null
    filters?: unknown
    auth?: unknown
}

export type JobOutput = {
    destination: string
    uri: string
    layout: string
    overwrite: boolean
    auth?: unknown
}

export type JobResponse = {
    job_id: string
    state: string
    reference_id?: string
    submitted_at?: string
    completed_at?: string
    input?: JobInput | null
    output?: JobOutput | null
    stats?: JobStats | null
    summary?: JobStats | null
    config?: Record<string, unknown> | null
    status?: string
    error?: ApiError
}

export type CancelResponse = { status: string }

export type MultiJobEntry = { job_id: string; state: string } | { error: string }
export type MultiJobResponse = { jobs: MultiJobEntry[] }

export type BatchApiResponse = ErrorResponse | FilesResponse | JobResponse | CancelResponse | MultiJobResponse

export type Job = { job_id: string; state: string; submitted_at?: string }

export function isErrorResponse(d: BatchApiResponse): d is ErrorResponse {
    return 'error' in d && (d as ErrorResponse).error != null
}

export function isFilesResponse(d: BatchApiResponse): d is FilesResponse {
    return 'files' in d && Array.isArray((d as FilesResponse).files)
}

export function isJobResponse(d: BatchApiResponse): d is JobResponse {
    return 'job_id' in d || ('state' in d && !('jobs' in d))
}

export function isMultiJobResponse(d: BatchApiResponse): d is MultiJobResponse {
    return 'jobs' in d && Array.isArray((d as MultiJobResponse).jobs)
}
