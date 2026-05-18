import { KJUR } from 'jsrsasign'
import dotenv from 'dotenv'
dotenv.config()

const ZOOM_API_KEY = process.env.ZOOM_API_KEY
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET
const BASE_URL = 'https://zoomdev.us/v2/aiservices/summarizer'

function generateJWT() {
    const now = Math.round(Date.now() / 1000)
    const iat = now - 30
    const exp = iat + 60 * 60 * 2
    const sHeader = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    const sPayload = JSON.stringify({ iss: ZOOM_API_KEY, iat, exp })
    return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, ZOOM_API_SECRET)
}

// Short sample transcript to keep responses fast
const SAMPLE_TRANSCRIPT = `
Alice: Good morning everyone, let's get started with our weekly sync.
Bob: Sure. I finished the API integration yesterday. Tests are passing.
Alice: Great. What's left before we can ship?
Bob: Just need code review and a quick smoke test on staging.
Carol: I can do the review today. Should take an hour.
Alice: Perfect. Carol, please review by noon. Bob, set up the smoke test after.
Bob: Will do. I'll ping the channel once staging is ready.
Alice: One more thing — we need to update the docs before release. Carol, can you handle that too?
Carol: Yes, I'll update the docs after the review.
Alice: Thanks everyone. Let's aim to ship by end of day.
`.trim()

const TASKS = ['recap', 'action_items', 'summary', 'full_summary']
const FORMATS = ['text', 'structured_json']

async function callSummarizer(task, output_format) {
    const jwt = generateJWT()
    const res = await fetch(`${BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: { text: SAMPLE_TRANSCRIPT },
            config: { task, output_format, language: 'en-us' },
        }),
    })
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
    return JSON.parse(text)
}

function describeShape(data) {
    const result = data?.result ?? {}
    const fields = Object.keys(result).filter(k => result[k] !== undefined && result[k] !== null)
    const details = {}
    for (const k of fields) {
        const v = result[k]
        const sample = String(v).slice(0, 80).replace(/\n/g, '\\n')
        const looksLikeMarkdown = /[#*`\-\[\]]/.test(v)
        details[k] = { chars: v.length, looksLikeMarkdown, sample: sample + (v.length > 80 ? '…' : '') }
    }
    return { fields, details }
}

console.log('Querying summarizer API — 8 combinations...\n')

for (const task of TASKS) {
    for (const output_format of FORMATS) {
        const label = `${task} / ${output_format}`
        process.stdout.write(`  ${label.padEnd(32)}`)
        try {
            const data = await callSummarizer(task, output_format)
            const { fields, details } = describeShape(data)
            console.log(`OK  fields: [${fields.join(', ')}]`)
            for (const [k, info] of Object.entries(details)) {
                const mdFlag = info.looksLikeMarkdown ? ' [MARKDOWN]' : ''
                console.log(`    ${k.padEnd(14)} ${info.chars} chars${mdFlag}`)
                console.log(`    ${' '.repeat(14)} "${info.sample}"`)
            }
        } catch (err) {
            console.log(`ERR ${err.message}`)
        }
        console.log()
    }
}
