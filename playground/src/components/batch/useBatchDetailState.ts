import { useState } from 'react'
import type { BatchApiResponse, FilesResponse } from '../../lib/batchTypes'
import { isFilesResponse } from '../../lib/batchTypes'

type JobAction = 'status' | 'files' | 'cancel'
type JobMutation = { mutate: (input: { jobId: string }) => void; isPending: boolean }

export function useBatchDetailState(invalidateJobs: () => void) {
    const [detail, setDetail] = useState<BatchApiResponse | null>(null)

    const clearDetail = () => setDetail(null)
    const onMutationError = (err: { message: string }) => setDetail({ error: err.message })
    const onJobComplete = (data: BatchApiResponse) => {
        setDetail(data)
        invalidateJobs()
    }
    const onDetailSuccess = (data: BatchApiResponse) => setDetail(data)
    const onMoreFilesSuccess = (data: FilesResponse) => {
        setDetail(prev => {
            if (prev && isFilesResponse(prev)) {
                return { files: [...prev.files, ...data.files], next_cursor: data.next_cursor }
            }
            return data
        })
    }

    const runJobAction = (action: JobAction, jobId: string, mutations: Record<JobAction, JobMutation>) => {
        setDetail(null)
        mutations[action].mutate({ jobId })
    }

    const getDetailLoading = (...pending: boolean[]) => pending.some(Boolean)

    return {
        detail,
        clearDetail,
        onMutationError,
        onJobComplete,
        onDetailSuccess,
        onMoreFilesSuccess,
        runJobAction,
        getDetailLoading,
    }
}
