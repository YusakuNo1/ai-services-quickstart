export function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

export function parseCommaSeparated(input: string): string[] | undefined {
    const parsed = input.split(',').map(s => s.trim()).filter(Boolean)
    return parsed.length > 0 ? parsed : undefined
}

export function buildAwsCreds(fromEnv: boolean, keyId: string, secret: string, session: string) {
    if (fromEnv || !keyId) return undefined
    return { access_key_id: keyId, secret_access_key: secret, session_token: session }
}


export function readFileAsDataUri(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(blob)
    })
}
