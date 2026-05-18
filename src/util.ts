import { KJUR } from 'jsrsasign'
import dotenv from 'dotenv'
dotenv.config()

export type AwsCredentials = {
    access_key_id?: string
    secret_access_key?: string
    session_token?: string
}

const ZOOM_API_KEY = process.env.ZOOM_API_KEY
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET
export const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2/'

if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
    throw new Error('ZOOM_API_KEY and ZOOM_API_SECRET are required')
}

export const generateJWT = () => {
    const now = Math.round(Date.now() / 1000)
    const iat = now - 30
    const exp = iat + 60 * 60 * 24 * 7
    const oHeader = { alg: 'HS256', typ: 'JWT' }
    const oPayload = {
        iss: ZOOM_API_KEY,
        iat: iat,
        exp: exp
    }
    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const API_JWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, ZOOM_API_SECRET)
    console.log(API_JWT)
    return API_JWT

}
generateJWT()

export function getEnvAwsCredentials(): AwsCredentials | undefined {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) return undefined
    return {
        access_key_id: process.env.AWS_ACCESS_KEY_ID,
        secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
        ...(process.env.AWS_SESSION_TOKEN && { session_token: process.env.AWS_SESSION_TOKEN }),
    }
}

export function isS3(value?: string): boolean {
    return String(value ?? '').toLowerCase() === 's3'
}

export function withAwsAuth<T extends { auth?: { aws?: AwsCredentials } }>(value: T | undefined, aws: AwsCredentials | undefined): T | undefined {
    if (!value) return undefined
    if (!aws) return value
    return { ...value, auth: { ...(value.auth ?? {}), aws } }
}

export function createApiRequest(basePath: string) {
    return async function makeRequest(path: string, init?: RequestInit) {
        const res = await fetch(`${basePath}${path}`, { ...init, headers: { Authorization: `Bearer ${generateJWT()}`, ...init?.headers } })
        if (!res.ok) throw new Error(await res.text() || res.statusText)
        if (res.status === 204) return null
        return res.json()
    }
}
