/**
 * ToolCallCard.jsx — src/renderer/components/ToolCallCard.jsx
 * Displays a tool invocation with its arguments and result.
 * Features: status badge (running/done/error), animated expand/collapse,
 * and formatted JSON display.
 */
import React from 'react'
import { Terminal } from 'lucide-react'

/**
 * WHAT:  Derives the status of a tool call from its result field.
 * PARAMS: result: any — the tool result value
 * RETURNS: 'running' | 'done' | 'error'
 */
function deriveStatus(result) {
  if (result === undefined || result === null) return 'running'
  if (typeof result === 'object' && result.error) return 'error'
  return 'done'
}

export function ToolCallCard({ name, args, result }) {
  const [expanded, setExpanded] = React.useState(false)
  const status = deriveStatus(result)

  return (
    <div className="tool-call-card">
      <div className="tool-call-header" onClick={() => setExpanded((v) => !v)}>
        <Terminal size={13} />
        <span className="tool-call-name">{name}</span>
        <div className="tool-call-status">
          {status === 'running' && <span className="tool-spinner" />}
          <span className={`tool-status-badge ${status}`}>{status}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
            {expanded ? '▾' : '▸'}
          </span>
        </div>
      </div>
      <div className={`tool-call-body ${expanded ? 'visible' : ''}`}>
        {args && (
          <div>
            <strong style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Args
            </strong>
            <pre>{JSON.stringify(args, null, 2)}</pre>
          </div>
        )}
        {result !== undefined && result !== null && (
          <div style={{ marginTop: args ? 8 : 0 }}>
            <strong style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Result
            </strong>
            <pre>
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
