/**
 * ReasoningBlock.jsx — src/renderer/components/ReasoningBlock.jsx
 * Collapsible reasoning/thinking block shown alongside assistant messages.
 * Renders content as Markdown with a smooth expand/collapse animation.
 */
import React from 'react'
import { Brain, ChevronDown } from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer.jsx'

export function ReasoningBlock({ content, isStreaming = false, expanded, onExpandedChange, defaultExpanded = false }) {
  const isControlled = typeof expanded === 'boolean'
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded)
  const open = isControlled ? expanded : internalExpanded

  const handleToggle = () => {
    const next = !open
    if (!isControlled) setInternalExpanded(next)
    onExpandedChange?.(next)
  }

  return (
    <div className={`reasoning-block ${isStreaming ? 'reasoning-live' : ''}`}>
      <button
        className="reasoning-toggle"
        onClick={handleToggle}
      >
        <Brain size={13} />
        Thinking
        <ChevronDown
          size={13}
          className={`reasoning-chevron ${open ? 'open' : ''}`}
        />
      </button>
      <div className={`reasoning-content ${open ? 'visible' : ''}`}>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  )
}
