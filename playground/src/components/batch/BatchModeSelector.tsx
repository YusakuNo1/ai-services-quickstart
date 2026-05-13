type ModeDescriptions<TMode extends string> = Record<TMode, { title: string; hint: string }>

export function BatchModeSelector<TMode extends string>({
    value,
    onChange,
    descriptions,
    disabledModes = [],
}: {
    value: TMode
    onChange: (value: TMode) => void
    descriptions: ModeDescriptions<TMode>
    disabledModes?: TMode[]
}) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {(Object.entries(descriptions) as [TMode, ModeDescriptions<TMode>[TMode]][]).map(([mode, meta]) => (
                <button
                    key={mode}
                    type="button"
                    disabled={disabledModes.includes(mode)}
                    onClick={() => onChange(mode)}
                    className={[
                        'flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border text-center transition-all duration-150',
                        value === mode
                            ? 'border-zoom-blue/60 bg-zoom-blue/5 text-zoom-blue'
                            : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        disabledModes.includes(mode) ? 'opacity-40 cursor-not-allowed hover:border-gray-200 hover:text-gray-500' : '',
                    ].join(' ')}
                >
                    <span className="text-xs font-semibold">{meta.title}</span>
                    <span className="text-[10px] leading-tight opacity-70">{meta.hint}</span>
                </button>
            ))}
        </div>
    )
}
