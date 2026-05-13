type Translation = { target_language: string; translated_text: string }
type TranslationMap = Record<string, string>

type TranslatorFastResponse = {
    translations?: Translation[]
    translations_map?: TranslationMap
    translations_by_language?: TranslationMap
    translations_dict?: TranslationMap
    translations_object?: TranslationMap
    translations_result?: TranslationMap
    translations_data?: TranslationMap
    translation?: Translation
    result?: {
        translations?: TranslationMap
    }
    source_language?: string
    detected_language?: string
    model?: string
    metadata?: Record<string, unknown>
    error?: unknown
}

interface Props {
    result: unknown
}

export function TranslatorResult({ result }: Props) {
    const loading = result === 'loading'
    const empty = result === null

    const data = (!loading && !empty) ? result as TranslatorFastResponse : null
    const errorMessage = typeof data?.error === 'string' ? data.error : null
    const translationMap = (data?.translations && !Array.isArray(data.translations) ? data.translations as unknown as TranslationMap : undefined)
        ?? data?.result?.translations
        ?? data?.translations_map
        ?? data?.translations_by_language
        ?? data?.translations_dict
        ?? data?.translations_object
        ?? data?.translations_result
        ?? data?.translations_data

    const translations = Array.isArray(data?.translations)
        ? data.translations
        : translationMap
            ? Object.entries(translationMap).map(([target_language, translated_text]) => ({ target_language, translated_text }))
            : (data?.translation ? [data.translation] : [])
    const sourceLang = data?.detected_language ?? data?.source_language
    const hasResult = translations.length > 0

    return (
        <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
                <div className={`w-2 h-2 rounded-full transition-colors ${loading ? 'bg-yellow-500 animate-pulse' : errorMessage ? 'bg-red-500' : hasResult ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className="text-xs font-medium text-gray-500">Translation</span>
                {sourceLang && (
                    <span className="ml-auto text-[10px] text-gray-400 font-mono">
                        source: <span className="text-gray-600 font-semibold">{sourceLang}</span>
                    </span>
                )}
                {!sourceLang && data?.model && (
                    <span className="ml-auto text-[10px] text-gray-400 font-mono">
                        model: <span className="text-gray-600 font-semibold">{data.model}</span>
                    </span>
                )}
            </div>
            <div className="bg-zoom-surface min-h-32">
                {loading ? (
                    <p className="p-4 text-xs text-gray-400 animate-pulse font-mono">Waiting for response...</p>
                ) : errorMessage ? (
                    <p className="p-4 text-xs font-mono text-red-600 whitespace-pre-wrap">{errorMessage}</p>
                ) : !hasResult ? (
                    <p className="p-4 text-xs text-gray-300 select-none font-mono">Translation will appear here...</p>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {translations.map(translation => (
                            <div key={translation.target_language} className="p-4">
                                <span className="inline-flex items-center gap-1 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                                    <span className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-gray-600">{translation.target_language}</span>
                                </span>
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{translation.translated_text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
