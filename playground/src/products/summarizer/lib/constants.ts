export const MAX_TEXT_BYTES = 96 * 1024

export const TASK_OPTIONS = [
    { value: 'recap', label: 'Recap', hint: '1-2 sentence overview' },
    { value: 'action_items', label: 'Action Items', hint: 'Extract next steps only' },
    { value: 'summary', label: 'Summary', hint: 'Detailed conversation summary' },
    { value: 'full_summary', label: 'Full Summary', hint: 'Recap, summary, and action items' },
] as const

export const OUTPUT_FORMAT_OPTIONS = [
    { value: 'structured_json', label: 'Structured JSON' },
    { value: 'text', label: 'Text' },
] as const

export const LANGUAGE_OPTIONS = [
    { value: 'ar-ae', label: 'Arabic (UAE)' },
    { value: 'ar-eg', label: 'Arabic (Egypt)' },
    { value: 'ar-sa', label: 'Arabic (Saudi Arabia)' },
    { value: 'de-de', label: 'German (Germany)' },
    { value: 'en-au', label: 'English (Australia)' },
    { value: 'en-gb', label: 'English (UK)' },
    { value: 'en-in', label: 'English (India)' },
    { value: 'en-nz', label: 'English (New Zealand)' },
    { value: 'en-us', label: 'English (US)' },
    { value: 'es-es', label: 'Spanish (Spain)' },
    { value: 'es-mx', label: 'Spanish (Mexico)' },
    { value: 'es-us', label: 'Spanish (US)' },
    { value: 'fr-ca', label: 'French (Canada)' },
    { value: 'fr-fr', label: 'French (France)' },
    { value: 'it-it', label: 'Italian (Italy)' },
    { value: 'ja-jp', label: 'Japanese (Japan)' },
    { value: 'pt-br', label: 'Portuguese (Brazil)' },
    { value: 'pt-pt', label: 'Portuguese (Portugal)' },
    { value: 'zh-cn', label: 'Chinese (China)' },
    { value: 'zh-hans', label: 'Chinese (Simplified Script)' },
    { value: 'zh-hant', label: 'Chinese (Traditional Script)' },
    { value: 'zh-tw', label: 'Chinese (Taiwan)' },
] as const

export type SummarizerTask = typeof TASK_OPTIONS[number]['value']
export type SummarizerOutputFormat = typeof OUTPUT_FORMAT_OPTIONS[number]['value']
export type SummarizerLanguage = typeof LANGUAGE_OPTIONS[number]['value']

export type FastSummarizerConfig = {
    task: SummarizerTask
    output_format: SummarizerOutputFormat
    language: SummarizerLanguage
    summary_type: 'conversation'
}

export type BatchSummarizerConfig = FastSummarizerConfig

export const defaultFastSummarizerConfig: FastSummarizerConfig = {
    task: 'summary',
    output_format: 'structured_json',
    language: 'en-us',
    summary_type: 'conversation',
}

export const defaultBatchSummarizerConfig = defaultFastSummarizerConfig

export const DEFAULT_TRANSCRIPT_GLOB = ''
