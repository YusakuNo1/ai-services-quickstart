import { createTRPCReact } from '@trpc/react-query'
import { httpLink } from '@trpc/client'
import type { AppRouter } from '../../../src/routers/index'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
    links: [
        httpLink({ url: '/trpc' }),
    ],
})
