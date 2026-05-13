import type { AsrConfig } from '../lib/constants'
import { inputCls } from '../../../lib/constants'
import { Field, ToggleRow } from '../../../components/ui'

export function AsrConfigForm({ value, onChange }: { value: AsrConfig; onChange: (v: AsrConfig) => void }) {
    const set = <K extends keyof AsrConfig>(k: K, v: AsrConfig[K]) => onChange({ ...value, [k]: v })
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Language" hint="BCP-47 code — en-US, es-ES, fr-FR, ja-JP…">
                    <input className={inputCls} value={value.language} onChange={e => set('language', e.target.value)} placeholder="en-US" />
                </Field>
                <ToggleRow label="Channel separation" hint="Transcribe stereo channels independently" checked={value.channel_separation} onChange={v => set('channel_separation', v)} />
            </div>
        </div>
    )
}
