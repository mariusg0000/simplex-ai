/**
 * ReasoningBlock.jsx — src/renderer/components/ReasoningBlock.jsx
 * Collapsible reasoning/thinking block shown alongside assistant messages.
 * Renders content as Markdown with a smooth expand/collapse animation.
 */
import React from 'react'
import { Brain, ChevronDown } from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer.jsx'

export function ReasoningBlock({ content }) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="reasoning-block">
      <button
        className="reasoning-toggle"
        onClick={() => setExpanded((v) => !v)}
      >
        <Brain size={13} />
        Thinking
        <ChevronDown
          size={13}
          className={`reasoning-chevron ${expanded ? 'open' : ''}`}
        />
      </button>
      <div className={`reasoning-content ${expanded ? 'visible' : ''}`}>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  )
}
