/**
 * ChatView.jsx — src/renderer/components/ChatView.jsx
 * Main chat panel: message list, suggestion chips empty state,
 * auto-resizing textarea input, send/abort button.
 */
import React from 'react'
import { ChatBubble } from './ChatBubble.jsx'
import { ReasoningBlock } from './ReasoningBlock.jsx'
import { ToolCallCard } from './ToolCallCard.jsx'
import { Send, Square } from 'lucide-react'

const SUGGESTIONS = [
  'Explică-mi un concept tehnic',
  'Scrie cod Python',
  'Ajutor cu un email',
  'Rezumă un text lung',
]

export function ChatView({ messages, onSend, streaming, reasoning, onAbort }) {
  const [input, setInput] = React.useState('')
  const messagesEndRef = React.useRef(null)
  const textareaRef = React.useRef(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || streaming) return
    onSend(trimmed)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const inputArea = (
    <div className="input-area">
      <div className="input-area-inner">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          disabled={!!streaming}
        />
        {streaming ? (
          <button className="btn-abort" onClick={onAbort} title="Stop generating">
            <Square size={14} />
          </button>
        ) : (
          <button className="btn-send" onClick={handleSubmit} title="Send (Enter)">
            <Send size={14} />
          </button>
        )}
      </div>
      <div className="input-hint">⏎ Send · ⇧⏎ New line</div>
    </div>
  )

  if (messages.length === 0 && !streaming) {
    return (
      <div className="chat-view">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Send size={24} />
          </div>
          <h2>Simplex AI</h2>
          <p>Send a message to start chatting</p>
          <div className="empty-state-chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                onClick={() => { setInput(s); textareaRef.current?.focus() }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {inputArea}
      </div>
    )
  }

  return (
    <div className="chat-view">
      <div className="messages-container">
        {messages.map((msg, i) => {
          if (msg.type === 'reasoning') {
            return <ReasoningBlock key={i} content={msg.content} />
          }
          if (msg.type === 'tool') {
            return <ToolCallCard key={i} name={msg.name} args={msg.args} result={msg.result} />
          }
          if (msg.role === 'user' || msg.role === 'assistant') {
            return <ChatBubble key={i} role={msg.role} content={msg.content} />
          }
          return null
        })}
        {streaming && <ChatBubble role="assistant" content={streaming} streaming />}
        {reasoning && <ReasoningBlock content={reasoning} />}
        <div ref={messagesEndRef} />
      </div>
      {inputArea}
    </div>
  )
}
