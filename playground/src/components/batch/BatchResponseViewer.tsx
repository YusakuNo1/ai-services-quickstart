import { useState } from 'react'
import { colorizeJson } from '../../lib/colorizeJson'
import { isErrorResponse, isFilesResponse, type BatchApiResponse } from '../../lib/batchTypes'

interface Props {
    detail: BatchApiResponse | null
    detailLoading: boolean
    visual?: React.ReactNode
    onLoadMore?: () => void
    loadingMore?: boolean
}

export function BatchResponseViewer({ detail, detailLoading, visual, onLoadMore, loadingMore }: Props) {
    const [showVisual, setShowVisual] = useState(false)
    const hasVisual = visual !== undefined

    const json = detail !== null ? JSON.stringify(detail, null, 2) : ''
    const colorized = colorizeJson(json)

    return (
        <div className="max-h-96 overflow-y-auto rounded-xl border border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${detailLoading ? 'bg-yellow-500 animate-pulse' : detail === null ? 'bg-gray-300' : isErrorResponse(detail) ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-medium text-gray-500">Response</span>
                </div>
                <div className="flex items-center gap-2">
                    {hasVisual && !detailLoading && detail !== null && (
                        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-gray-100 border border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowVisual(false)}
                                className={`px-2 py-0.5 text-[11px] rounded-md transition-all ${!showVisual ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                JSON
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowVisual(true)}
                                className={`px-2 py-0.5 text-[11px] rounded-md transition-all ${showVisual ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Visual
                            </button>
                        </div>
                    )}
                    {!detailLoading && detail !== null && !showVisual && (
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(json)}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Copy
                        </button>
                    )}
                </div>
            </div>
            {showVisual && !detailLoading && visual ? (
                <div className="p-4 bg-zoom-surface flex-1 overflow-y-auto">
                    {visual}
                </div>
            ) : (
                <pre className="p-4 text-xs font-mono overflow-y-scroll flex-1 whitespace-pre-wrap wrap-break-word leading-relaxed bg-zoom-surface min-h-48">
                    {detailLoading
                        ? <span className="text-gray-400 animate-pulse">Waiting for response…</span>
                        : detail === null
                            ? <span className="text-gray-300 select-none">Response will appear here…</span>
                            : colorized
                    }
                </pre>
            )}
            {!detailLoading && detail !== null && isFilesResponse(detail) && detail.next_cursor && onLoadMore && (
                <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {loadingMore ? '…' : '↓'} {loadingMore ? 'Loading…' : 'Load more files'}
                    </button>
                </div>
            )}
        </div>
    )
}
