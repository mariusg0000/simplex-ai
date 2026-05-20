/**
 * ChatBubble.jsx — src/renderer/components/ChatBubble.jsx
 * Individual message bubble for user and assistant roles.
 * Features: Bot/User avatar icon, copy-to-clipboard button,
 * streaming cursor, and entry animation.
 */
import React from 'react'
import { MarkdownRenderer } from './MarkdownRenderer.jsx'
import { Bot, User, Copy, Check } from 'lucide-react'

export function ChatBubble({ role, content, streaming }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <div className={`chat-bubble ${role}`}>
      <div className="chat-bubble-header">
        {/* Avatar */}
        <div className={`bubble-avatar ${role}`}>
          {role === 'assistant'
            ? <Bot size={12} />
            : <User size={12} />
          }
        </div>
        <span className="role-label">{role === 'user' ? 'You' : 'AI'}</span>

        {/* Copy button — only when not streaming */}
        {!streaming && content && (
          <div className="bubble-actions">
            <button
              className={`bubble-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>

      <MarkdownRenderer content={content} />
      {streaming && <span className="stream-indicator" />}
    </div>
  )
}
