/**
 * StatusBar.jsx — src/renderer/components/StatusBar.jsx
 * Bottom application status bar.
 * Shows: animated status dot + label (left), active model chip (center),
 * token count + cost (right).
 */
import React from 'react'
import { Zap, DollarSign } from 'lucide-react'

/**
 * WHAT:  Maps a status string to a CSS class for the dot indicator.
 * PARAMS: status: string
 * RETURNS: 'ready' | 'streaming' | 'error'
 */
function dotClass(status) {
  if (!status || status === 'Ready') return 'ready'
  if (status.toLowerCase().includes('stream')) return 'streaming'
  if (status.toLowerCase().includes('error') || status.toLowerCase().includes('cancel')) return 'error'
  return 'streaming'
}

export function StatusBar({ tokens, cost, status, activeModel }) {
  const dot = dotClass(status)

  // Format the active model string for display: "provider/model-name" → "model-name"
  const modelLabel = activeModel
    ? activeModel.includes('/')
      ? activeModel.split('/').slice(1).join('/')
      : activeModel
    : null

  const providerLabel = activeModel && activeModel.includes('/')
    ? activeModel.split('/')[0]
    : null

  return (
    <div className="status-bar">
      {/* Left: status indicator */}
      <div className="status-bar-left">
        <span className={`status-dot ${dot}`} />
        <span className="status-text">{status || 'Ready'}</span>
      </div>

      {/* Center: active model chip */}
      <div className="status-bar-center">
        {modelLabel && (
          <span className="status-model-chip">
            {providerLabel && (
              <span style={{ opacity: 0.6, marginRight: 2 }}>{providerLabel} /</span>
            )}
            {modelLabel}
          </span>
        )}
      </div>

      {/* Right: token count + cost */}
      <div className="status-bar-right">
        {tokens !== undefined && tokens > 0 && (
          <span className="status-stat">
            <Zap size={10} />
            {tokens.toLocaleString()} tokens
          </span>
        )}
        {cost !== undefined && cost > 0 && (
          <span className="status-stat">
            <DollarSign size={10} />
            {cost.toFixed(6)}
          </span>
        )}
      </div>
    </div>
  )
}
