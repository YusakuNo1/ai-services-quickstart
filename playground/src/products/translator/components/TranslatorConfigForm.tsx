import { selectCls } from '../../../lib/constants'
import { Field } from '../../../components/ui'
import {
    TARGET_LANGUAGE_OPTIONS,
    type SourceLanguageCode,
    type TargetLanguageCode,
    type TranslatorConfig,
} from '../lib/constants'

export function TranslatorConfigForm({ value, onChange }: { value: TranslatorConfig; onChange: (v: TranslatorConfig) => void }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Source Language" hint="Select source language">
                <select
                    className={selectCls}
                    value={value.source_language}
                    onChange={e => onChange({ ...value, source_language: e.target.value as SourceLanguageCode })}
                >
                    {TARGET_LANGUAGE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </Field>

            <Field label="Target Language" hint="Currently supports one target language per request">
                <select
                    className={selectCls}
                    value={value.target_languages[0] ?? ''}
                    onChange={e => onChange({ ...value, target_languages: [e.target.value as TargetLanguageCode] })}
                >
                    {TARGET_LANGUAGE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </Field>
        </div>
    )
}
