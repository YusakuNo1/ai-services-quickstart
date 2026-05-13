import ReactMarkdown from 'react-markdown'

export function MarkdownContent({ children }: { children: string }) {
    return (
        <ReactMarkdown
            components={{
                h1: ({ children }) => <h1 className="text-base font-semibold text-gray-900 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-semibold text-gray-800 mb-1.5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-medium text-gray-700 mb-1">{children}</h3>,
                p: ({ children }) => <p className="text-sm text-gray-800 leading-relaxed mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-outside pl-4 mb-2 space-y-0.5 text-sm text-gray-800">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside pl-4 mb-2 space-y-0.5 text-sm text-gray-800">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => <code className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700">{children}</code>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-gray-300 pl-3 text-sm text-gray-600 italic mb-2">{children}</blockquote>
                ),
                hr: () => <hr className="border-gray-200 my-2" />,
            }}
        >
            {children}
        </ReactMarkdown>
    )
}
