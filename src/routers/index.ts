import { router } from '../trpc.js'
import { scribeRouter } from './scribe.js'
import { translatorRouter } from './translator.js'
import { summarizerRouter } from './summarizer.js'

export const appRouter = router({
    translator: translatorRouter,
    scribe: scribeRouter,
    summarizer: summarizerRouter,
})

export type AppRouter = typeof appRouter
