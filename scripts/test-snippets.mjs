import { KJUR } from 'jsrsasign'
import dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

dotenv.config()

const ZOOM_API_KEY = process.env.ZOOM_API_KEY
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET
const BASE = 'https://api.zoom.us/v2'

function jwt() {
    const now = Math.round(Date.now() / 1000)
    const sHeader = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    const sPayload = JSON.stringify({ iss: ZOOM_API_KEY, iat: now - 30, exp: now + 60 * 60 })
    return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, ZOOM_API_SECRET)
}

async function post(path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const text = await res.text()
    return { status: res.status, ok: res.ok, body: text }
}

function summarize(out, label) {
    const head = `[${out.status}] ${label}`
    if (!out.ok) {
        console.log(`${head} FAIL`)
        console.log('  ', out.body.slice(0, 400))
        return false
    }
    try {
        const parsed = JSON.parse(out.body)
        console.log(`${head} OK — keys: ${Object.keys(parsed).join(', ')}`)
    } catch {
        console.log(`${head} OK (non-JSON)`)
    }
    return true
}

// --- Scribe: needs a public audio URL. Use a small sample.
const SCRIBE_URL = 'https://www.signalogic.com/melp/EngSamples/Orig/male.wav'
const scribeOut = await post('/aiservices/scribe/transcribe', { file: SCRIBE_URL })
summarize(scribeOut, 'scribe.transcribe')

// --- Summarizer
const TRANSCRIPT = `Alice: Morning. Let's review status.
Bob: API integration is done, tests pass.
Alice: Great — what's left to ship?
Bob: Code review and a smoke test.
Carol: I'll review this morning.
Alice: Perfect. Ship by EOD.`
const sumOut = await post('/aiservices/summarizer/summarize', {
    input: { text: TRANSCRIPT },
    config: { task: 'summary', output_format: 'structured_json', language: 'en-us', summary_type: 'conversation' },
})
summarize(sumOut, 'summarizer.summarize')

// --- Translator
const transOut = await post('/aiservices/translator/translate', {
    text: 'Hello, how are you today?',
    config: { source_language: 'en-US', target_languages: ['es-ES'] },
})
summarize(transOut, 'translator.translate')
