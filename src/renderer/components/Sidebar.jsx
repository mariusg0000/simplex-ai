/**
 * Sidebar.jsx — src/renderer/components/Sidebar.jsx
 * Left navigation panel: branding, theme toggle, session search,
 * session list with relative timestamps, and RAG panel.
 */
import React from 'react'
import { Plus, Settings as SettingsIcon, Trash2, Edit3, Search, Sun, Moon, Sparkles, Database } from 'lucide-react'
import { RAGPanel } from './RAGPanel.jsx'

/**
 * WHAT:  Formats a Unix timestamp (seconds) into a human-readable relative string.
 * WHY:   Chat history feels more alive with contextual time labels.
 * HOW:   Compares to current time; returns "Today", "Yesterday", "N days ago", or date.
 * PARAMS: ts: number — Unix timestamp in seconds
 * RETURNS: string
 */
function relativeDate(ts) {
  if (!ts) return ''
  const now = new Date()
  const date = new Date(ts * 1000)
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function Sidebar({ sessions, currentId, onSelect, onNew, onDelete, onRename, onSettings, theme, onToggleTheme }) {
  const [editingId, setEditingId] = React.useState(null)
  const [editTitle, setEditTitle] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleStartRename = (id, title) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const handleFinishRename = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const filteredSessions = searchQuery.trim()
    ? sessions.filter((s) =>
        (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sessions

  return (
    <div className="sidebar">
      {/* ── Header: logo + actions ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Sparkles size={14} />
          </div>
          <span className="sidebar-wordmark">Simplex AI</span>
        </div>
        <div className="sidebar-header-actions">
          <button className="btn-icon" onClick={onNew} title="New session">
            <Plus size={16} />
          </button>
          <button
            className="btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn-icon" onClick={onSettings} title="Settings">
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="sidebar-search">
        <div className="sidebar-search-inner">
          <Search size={13} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Session list ── */}
      <div className="sidebar-chat-list">
        <div className="sidebar-section-header">Chats</div>
        <div className="sidebar-list">
          {filteredSessions.length === 0 && (
            <div className="text-muted" style={{ padding: '8px 4px', textAlign: 'center' }}>
              {searchQuery ? 'No results' : 'No chats yet'}
            </div>
          )}
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${session.id === currentId ? 'active' : ''}`}
              onClick={() => onSelect(session.id)}
            >
              <div className="session-item-body">
                {editingId === session.id ? (
                  <input
                    className="session-title-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinishRename()
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="session-title">{session.title || 'New Chat'}</div>
                    <div className="session-date">{relativeDate(session.updated_at)}</div>
                  </>
                )}
              </div>
              <div className="session-actions">
                <button
                  className="btn-icon"
                  onClick={(e) => { e.stopPropagation(); handleStartRename(session.id, session.title) }}
                  title="Rename"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  className="btn-icon"
                  onClick={(e) => { e.stopPropagation(); onDelete(session.id) }}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RAG Panel ── */}
      <RAGPanel />
    </div>
  )
}
