import { memo } from "react"
import { Options } from "react-markdown"
import React from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from "remark-gfm"
function MarkdownSlice({ children, className = "", ...props }: Options) {
    return (
        <Markdown
           
            components={{
                code(props: any) {
                    const { children, className, node, ...rest } = props
                    const match = /language-(\w+)/.exec(className || "")
                    return match? (
                        <SyntaxHighlighter
                            {...rest}
                            style={a11yDark}
                            language={match?.[1] ?? ""}
                            PreTag="div"
                        >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                        
                    ) 
                    : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
                }
            }}
            remarkPlugins={[remarkGfm]}
            className={`markdown prose dark:prose-invert ${className}`}
            {...props}
        >
            {children}
            </Markdown>
    )
}

export default memo(MarkdownSlice)