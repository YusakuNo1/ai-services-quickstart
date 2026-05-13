import { useMemo, useState } from 'react'
import { JsonResult } from '../../../components/JsonResult'
import { Card, SectionHeading, Spinner } from '../../../components/ui'
import { trpc } from '../../../lib/trpc'
import { SummarizerConfigForm } from '../components/SummarizerConfigForm'
import { SummarizerResult } from '../components/SummarizerResult'
import { MAX_TEXT_BYTES, defaultFastSummarizerConfig, type FastSummarizerConfig } from '../lib/constants'

const encoder = new TextEncoder()

export function FastTab() {
    const [text, setText] = useState('')
    const [config, setConfig] = useState<FastSummarizerConfig>(defaultFastSummarizerConfig)

    const summarizeMutation = trpc.summarizer.summarize.useMutation()

    const byteLength = useMemo(() => encoder.encode(text).length, [text])
    const bytesLeft = MAX_TEXT_BYTES - byteLength
    const overLimit = bytesLeft < 0
    const canSubmit = text.trim().length > 0 && !overLimit

    const response = summarizeMutation.data ?? (summarizeMutation.error ? { error: summarizeMutation.error.message } : null)
    const busy = summarizeMutation.isPending

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        summarizeMutation.mutate({
            input: { text },
            config,
        })
    }

    return (
        <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:items-start gap-5">
            <form id="summarizer-fast-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Card>
                    <SectionHeading title="Conversation Transcript" />
                    <div className="relative">
                        <textarea
                            className={[
                                'w-full px-3 py-2.5 rounded-lg text-sm text-gray-900 bg-white border resize-none',
                                'focus:outline-none focus:ring-1 transition-all duration-150',
                                'placeholder:text-gray-400 leading-relaxed',
                                overLimit
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-zoom-blue/60 focus:ring-zoom-blue/30',
                            ].join(' ')}
                            rows={12}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Paste a meeting transcript, call transcript, chat conversation, or speaker-attributed dialogue here..."
                        />
                        <span className={[
                            'absolute bottom-2.5 right-3 text-[10px] font-mono tabular-nums pointer-events-none',
                            overLimit ? 'text-red-500 font-semibold' : bytesLeft < 8 * 1024 ? 'text-amber-500' : 'text-gray-400',
                        ].join(' ')}>
                            {byteLength.toLocaleString()} / {MAX_TEXT_BYTES.toLocaleString()} bytes
                        </span>
                    </div>
                    {overLimit && (
                        <p className="mt-1 text-xs text-red-500">
                            Transcript exceeds the 96 KB fast-input limit by {(-bytesLeft).toLocaleString()} bytes.
                        </p>
                    )}
                </Card>

                <Card>
                    <SectionHeading title="Summarization Config" />
                    <SummarizerConfigForm value={config} onChange={value => setConfig(value as FastSummarizerConfig)} />
                </Card>
            </form>

            <div className="lg:sticky lg:top-20">
                <button
                    form="summarizer-fast-form"
                    type="submit"
                    disabled={busy || !canSubmit}
                    className={[
                        'flex items-center gap-2 self-start px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 mb-4',
                        busy || !canSubmit
                            ? 'bg-zoom-blue/50 text-white cursor-not-allowed'
                            : 'bg-zoom-blue hover:bg-zoom-blue-hover active:scale-95 text-white shadow-lg shadow-zoom-blue/25',
                    ].join(' ')}
                >
                    {busy && <Spinner />}
                    {busy ? 'Summarizing...' : '\u25B6 Summarize'}
                </button>
                <SummarizerResult result={busy ? 'loading' : response} />
                <JsonResult data={busy ? null : response} loading={busy} />
            </div>
        </div>
    )
}
