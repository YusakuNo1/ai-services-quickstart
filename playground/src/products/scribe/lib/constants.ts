export type AsrConfig = {
    language: string
    channel_separation: boolean
}

export const defaultAsrConfig: AsrConfig = {
    language: 'en-US',
    channel_separation: false,
}
