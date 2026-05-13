import { useState } from 'react'
import { JsonResult } from '../../../components/JsonResult'
import { Card, SectionHeading, Spinner } from '../../../components/ui'
import { defaultTranslatorConfig, MAX_TEXT_LENGTH, type TranslatorConfig } from '../lib/constants'
import { TranslatorConfigForm } from '../components/TranslatorConfigForm'
import { TranslatorResult } from '../components/TranslatorResult'
import { trpc } from '../../../lib/trpc'

export function FastTab() {
    const [text, setText] = useState('')
    const [config, setConfig] = useState<TranslatorConfig>(defaultTranslatorConfig)

    const translateMutation = trpc.translator.translate.useMutation()

    const charsLeft = MAX_TEXT_LENGTH - text.length
    const overLimit = charsLeft < 0
    const canSubmit = text.trim().length > 0 && !overLimit

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault()
        translateMutation.mutate({ text, config })
    }

    const busy = translateMutation.isPending

    return (
        <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:items-start gap-5">
            <form id="translator-fast-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Card>
                    <SectionHeading title="Text to Translate" />
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
                            rows={8}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Enter text to translate - chat messages, UI strings, short notes, or workflow actions..."
                        />
                        <span className={[
                            'absolute bottom-2.5 right-3 text-[10px] font-mono tabular-nums pointer-events-none',
                            overLimit ? 'text-red-500 font-semibold' : charsLeft < 200 ? 'text-amber-500' : 'text-gray-400',
                        ].join(' ')}>
                            {text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}
                        </span>
                    </div>
                    {overLimit && (
                        <p className="mt-1 text-xs text-red-500">
                            Text exceeds the {MAX_TEXT_LENGTH.toLocaleString()} character limit by {(-charsLeft).toLocaleString()} characters.
                        </p>
                    )}
                </Card>

                <Card>
                    <SectionHeading title="Translator Config" />
                    <TranslatorConfigForm value={config} onChange={setConfig} />
                </Card>
            </form>

            <div className="lg:sticky lg:top-20">
                <button
                    form="translator-fast-form"
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
                    {busy ? 'Translating...' : '▶ Translate'}
                </button>
                <TranslatorResult result={busy ? 'loading' : translateMutation.data ?? null} />
                <JsonResult data={busy ? null : (translateMutation.data ?? null)} loading={busy} />
            </div>
        </div>
    )
}
