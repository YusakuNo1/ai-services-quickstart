import type { BaseBatchFormState, BatchInputMode } from './formTypes'

type AwsCredentialsInput = {
    access_key_id: string
    secret_access_key: string
    session_token: string
}

export function parseManifestEntries(input: string): string[] | undefined {
    const trimmed = input.trim()
    const entries = trimmed
        ? trimmed.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'))
        : undefined

    return entries?.length ? entries : undefined
}

export function isHttpBatchInput(mode: BatchInputMode, inputUri: string, manifestList: string[] | undefined): boolean {
    return mode === 'MANIFEST'
        ? (manifestList ?? []).every(uri => uri.startsWith('http'))
        : inputUri.startsWith('http')
}

export function buildBatchSubmitPayload<TConfig, TOutputLayout extends string>({
    form,
    manifestList,
    includeGlobs,
    excludeGlobs,
    inputAws,
    outputAws,
}: {
    form: BaseBatchFormState<TConfig, TOutputLayout>
    manifestList: string[] | undefined
    includeGlobs: string[] | undefined
    excludeGlobs: string[] | undefined
    inputAws: AwsCredentialsInput | undefined
    outputAws: AwsCredentialsInput | undefined
}) {
    const isHttpInput = isHttpBatchInput(form.inputMode, form.inputUri, manifestList)

    return {
        input: {
            ...(!isHttpInput && { source: 'S3' }),
            mode: form.inputMode,
            ...(form.inputUri && { uri: form.inputUri }),
            ...(manifestList && { manifest: manifestList }),
            ...((includeGlobs || excludeGlobs) && {
                filters: {
                    ...(includeGlobs && { include_globs: includeGlobs }),
                    ...(excludeGlobs && { exclude_globs: excludeGlobs }),
                },
            }),
            ...(inputAws && { auth: { aws: inputAws } }),
        },
        output: {
            destination: 'S3',
            uri: form.outputUri,
            layout: form.inputMode === 'PREFIX' ? form.outputLayout : 'PREFIX',
            overwrite: false,
            ...(outputAws && { auth: { aws: outputAws } }),
        },
        config: form.config,
        ...(form.referenceId && { reference_id: form.referenceId }),
        ...(form.webhookUrl && {
            notifications: {
                webhook_url: form.webhookUrl,
                ...(form.webhookSecret && { secret: form.webhookSecret }),
            },
        }),
    }
}
